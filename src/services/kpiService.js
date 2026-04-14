import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export const getDashboardMetrics = async (organizationId) => {
  try {
    // 1. Fetch ideas
    const ideasQuery = query(collection(db, "ideas"), where("organizationId", "==", organizationId));
    const ideasSnapshot = await getDocs(ideasQuery);
    const ideas = ideasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Fetch organization name
    const orgsQuery = query(collection(db, "organizations"), where("id", "==", organizationId));
    const orgsSnapshot = await getDocs(orgsQuery);
    let organizationName = organizationId;
    if (!orgsSnapshot.empty) {
      organizationName = orgsSnapshot.docs[0].data().name || organizationId;
    } else {
      // Fallback: Check if the document ID matches the organizationId instead
      const fallbackOrgRef = await getDocs(collection(db, "organizations"));
      const matchingOrg = fallbackOrgRef.docs.find(d => d.id === organizationId || d.data().id === organizationId);
      if (matchingOrg) {
        organizationName = matchingOrg.data().name || organizationId;
      }
    }

    // 2. Fetch users
    const usersQuery = query(collection(db, "users"), where("organizationId", "==", organizationId));
    const usersSnapshot = await getDocs(usersQuery);
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 3. Fetch departments
    const deptsQuery = query(collection(db, "departments"), where("organizationId", "==", organizationId));
    const deptsSnapshot = await getDocs(deptsQuery);
    const departments = deptsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 4. Fetch idea_stage_history
    // Note: If idea_stage_history doesn't have organizationId, we may fetch all and filter, or assume it does.
    // The prompt SCHEMA for idea_stage_history: id, ideaId, stage, enteredAt, exitedAt.
    // Since we don't have organizationId in idea_stage_history, we fetch all for the given ideas.
    // Firestore `in` query is limited to 10. Better to just fetch all if possible, or fetch in chunks.
    // Assuming small dataset for now, or we can fetch all and filter.
    const historySnapshot = await getDocs(collection(db, "idea_stage_history"));
    const ideaIds = new Set(ideas.map(i => i.id));
    const history = historySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(h => ideaIds.has(h.ideaId));

    // Calculate DIRI Readiness Index
    const advancedStages = ["Review", "Approval", "Pilot"];
    const advancedIdeasCount = ideas.filter(idea => advancedStages.includes(idea.stage)).length;
    const diriPercentage = ideas.length > 0 ? (advancedIdeasCount / ideas.length) * 100 : 0;
    
    let diriLabel = "Low";
    if (diriPercentage > 70) diriLabel = "High";
    else if (diriPercentage > 40) diriLabel = "Moderate";

    // Calculate ITRI Trust Index & Participation Rate
    const distinctSubmitters = new Set(ideas.map(idea => idea.submittedBy)).size;
    const totalUsers = users.length;
    const itriPercentage = totalUsers > 0 ? (distinctSubmitters / totalUsers) * 100 : 0;
    const participationRate = itriPercentage; // Same formula per prompt

    // Calculate Innovation Velocity (transitions in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const velocity = history.filter(h => {
      // Handle Firestore timestamp or standard Date
      const enteredAt = h.enteredAt?.toDate ? h.enteredAt.toDate() : new Date(h.enteredAt);
      return enteredAt >= thirtyDaysAgo;
    }).length;

    // Calculate Time-to-Decision
    let totalDecisionDays = 0;
    let decisionCount = 0;

    ideas.forEach(idea => {
      const ideaHistory = history.filter(h => h.ideaId === idea.id);
      const draftingStage = ideaHistory.find(h => h.stage === "Drafting");
      const approvalStage = ideaHistory.find(h => h.stage === "Approval");

      if (draftingStage && approvalStage && draftingStage.enteredAt && approvalStage.enteredAt) {
        const dStart = draftingStage.enteredAt.toDate ? draftingStage.enteredAt.toDate() : new Date(draftingStage.enteredAt);
        const aStart = approvalStage.enteredAt.toDate ? approvalStage.enteredAt.toDate() : new Date(approvalStage.enteredAt);
        const diffInDays = (aStart - dStart) / (1000 * 60 * 60 * 24);
        if (diffInDays > 0) {
          totalDecisionDays += diffInDays;
          decisionCount++;
        }
      }
    });
    const timeToDecision = decisionCount > 0 ? (totalDecisionDays / decisionCount) : 0;

    // Calculate ROI-M Pipeline
    const roiStages = ["Drafting", "Review", "Approval", "Pilot"];
    const roiIdeas = ideas.filter(idea => roiStages.includes(idea.stage));
    const roiPipeline = roiIdeas.reduce((sum, idea) => sum + (idea.potentialValue || 0), 0);

    // Calculate IFH Friction Heatmap
    // Average Stage Duration (days) by Department and Stage
    const heatmapStages = ["Drafting", "Review", "Approval", "Pilot"];
    const frictionMap = {}; // { deptName: { Drafting: avg, Review: avg, ... } }

    departments.forEach(dept => {
      frictionMap[dept.name] = {};
      heatmapStages.forEach(stage => frictionMap[dept.name][stage] = null);
    });

    const deptStageAggregates = {};
    
    history.forEach(h => {
      if (!heatmapStages.includes(h.stage) || !h.exitedAt || !h.enteredAt) return;
      
      const idea = ideas.find(i => i.id === h.ideaId);
      if (!idea) return;
      
      const dept = departments.find(d => d.id === idea.departmentId);
      if (!dept) return;

      const enterD = h.enteredAt.toDate ? h.enteredAt.toDate() : new Date(h.enteredAt);
      const exitD = h.exitedAt.toDate ? h.exitedAt.toDate() : new Date(h.exitedAt);
      const days = (exitD - enterD) / (1000 * 60 * 60 * 24);

      if (!deptStageAggregates[dept.name]) deptStageAggregates[dept.name] = {};
      if (!deptStageAggregates[dept.name][h.stage]) deptStageAggregates[dept.name][h.stage] = { totalDays: 0, count: 0 };
      
      deptStageAggregates[dept.name][h.stage].totalDays += days;
      deptStageAggregates[dept.name][h.stage].count++;
    });

    // Populate frictionMap averages
    Object.keys(deptStageAggregates).forEach(deptName => {
      Object.keys(deptStageAggregates[deptName]).forEach(stage => {
        const agg = deptStageAggregates[deptName][stage];
        if (frictionMap[deptName]) {
          frictionMap[deptName][stage] = agg.count > 0 ? (agg.totalDays / agg.count) : null;
        }
      });
    });

    // Calculate Innovation Portfolio Snapshot
    // Top 5 ideas by aiScore desc
    const topIdeas = [...ideas]
      .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))
      .slice(0, 5)
      .map(idea => {
        const dept = departments.find(d => d.id === idea.departmentId);
        return {
          id: idea.id,
          title: idea.title,
          departmentName: dept ? dept.name : "Unknown",
          stage: idea.stage,
          pathway: idea.pathway,
          aiScore: idea.aiScore,
          potentialValue: idea.potentialValue
        };
      });

    return {
      diri: { percentage: diriPercentage, label: diriLabel },
      itri: itriPercentage,
      velocity,
      timeToDecision,
      participationRate,
      roiPipeline,
      frictionMap,
      topIdeas,
      organizationName,
    };
  } catch (error) {
    console.error("Error calculating KPIs:", error);
    throw error; // Let the UI handle the error state
  }
};
