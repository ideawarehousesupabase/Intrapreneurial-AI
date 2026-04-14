import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, RotateCcw, AlertTriangle, UserPlus, History } from "lucide-react";
import { doc, getDoc, collection, query, where, limit, getDocs, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import { generateSequentialId } from "@/utils/generateSequentialId";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";



// Fallback for ideas not explicitly defined
const defaultIdea: IdeaDetail = {
  title: "Idea Detail",
  pathway: "Fast-Track",
  submittedBy: "Team Member",
  department: "General",
  timeAgo: "recently",
  problemStatement: "Details are being prepared for this idea.",
  currentLoss: "£125,000",
  hoursLost: "40 hrs",
  proposedSolution: "Solution details pending.",
  expectedValue: "Value assessment pending.",
  strategicAlignment: ["Pending"],
  risks: "Risk assessment pending.",
  overallScore: 0,
  roiScore: 0,
  feasibilityScore: 0,
  strategicFitScore: 0,
  assessment: "Pending Assessment",
  similarIdeas: [
    {
      title: "Warehouse Inventory System (2024)",
      dept: "Operations",
      similarity: "78%",
      status: "Implemented",
      description: "Automated stock counting reduced discrepancies by 65%. Key learnings: ensure barcode quality standards."
    },
    {
      title: "Predictive Demand Planning (2023)",
      dept: "Supply Chain",
      similarity: "62%",
      status: "Archived",
      description: "Similar approach but lacked integration budget. Current idea addresses this gap."
    }
  ],
  suggestedCollaborator: { name: "TBD", role: "Role pending", reason: "Collaborator to be assigned", initials: "??" },
  teamWarning: "Team composition analysis pending.",
};

interface IdeaDetail {
  title: string;
  pathway: string;
  submittedBy: string;
  department: string;
  timeAgo: string;
  problemStatement: string;
  currentLoss: string;
  hoursLost: string;
  proposedSolution: string;
  expectedValue: string;
  strategicAlignment: string[];
  risks: string;
  overallScore: number;
  roiScore: number;
  feasibilityScore: number;
  strategicFitScore: number;
  assessment: string;
  similarIdeas: { title: string; dept: string; similarity: string; status: string; description: string }[];
  suggestedCollaborator: { name: string; role: string; reason: string; initials: string };
  teamWarning: string;
}



function ScoreProgressBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-foreground">{label}</span>
        <span className="font-semibold text-foreground">{score}/100</span>
      </div>
      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

const DecisionPortal = () => {
  const { ideaId } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<IdeaDetail>(defaultIdea);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdea = async () => {
      if (!ideaId) {
         setLoading(false);
         return;
      }
      try {
        const ideaDoc = await getDoc(doc(db, "ideas", ideaId));
        if (!ideaDoc.exists()) throw new Error("Idea not found");
        const data = ideaDoc.data();
        
        const narrativeQuery = query(collection(db, "inie_narratives"), where("idea_id", "==", ideaId), limit(1));
        const narrativeSnap = await getDocs(narrativeQuery);
        const narrativeData = narrativeSnap.empty ? {} : narrativeSnap.docs[0].data();

        const deptDoc = await getDoc(doc(db, "departments", data.departmentId || ""));
        const userDoc = await getDoc(doc(db, "users", data.submittedBy || ""));
        
        const deptName = deptDoc.exists() ? deptDoc.data().name : "Unknown Department";
        const submitterData = userDoc.exists() ? userDoc.data() : { name: "Unknown" };

        const collabDoc = await getDoc(doc(db, "users", "user_001"));
        const collabData = collabDoc.exists() ? collabDoc.data() : { name: "User 001", role: "Technical Lead" };
        let collabInitials = "U1";
        if (collabData.name) {
          const parts = collabData.name.split(" ");
          collabInitials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : collabData.name.substring(0, 2).toUpperCase();
        }

        let assessmentString = "Analysis Pending";
        if (data.strategicFitScore > 80 && data.feasibilityScore > 80) assessmentString = "High Strategic Fit, High Feasibility";
        else if (data.strategicFitScore > 75) assessmentString = "High Strategic Fit, Medium Feasibility";
        
        setIdea({
          ...defaultIdea,
          title: data.title,
          pathway: data.pathway || "Fast-Track",
          submittedBy: submitterData.name || "Unknown",
          department: deptName,
          timeAgo: new Date(data.submittedAt?.toMillis() || Date.now()).toLocaleDateString(),
          problemStatement: narrativeData.problem_statement || "No statement provided",
          proposedSolution: narrativeData.proposed_solution || "No solution provided",
          expectedValue: narrativeData.expected_value || "No value expected provided",
          risks: narrativeData.risks_assumptions || "None stated",
          strategicAlignment: [narrativeData.strategic_alignment || "Efficiency"],
          overallScore: Math.floor(((data.roiScore || 0) + (data.feasibilityScore || 0) + (data.strategicFitScore || 0)) / 3) || data.aiScore || 0,
          roiScore: data.roiScore || 0,
          feasibilityScore: data.feasibilityScore || 0,
          strategicFitScore: data.strategicFitScore || 0,
          assessment: assessmentString,
          suggestedCollaborator: {
            name: collabData.name || "User 001",
            role: collabData.jobTitle || collabData.role || "Technical Reviewer",
            reason: "Algorithm detected synergistic skillsets based on past success.",
            initials: collabInitials
          },
          teamWarning: "Team currently lacks deep technical feasibility expertise.",
        });

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIdea();
  }, [ideaId]);

  const onBack = () => navigate("/innovation-portfolio");

  const [aimpPathway, setAimpPathway] = useState(idea?.pathway || "Fast-Track");
  const [budget, setBudget] = useState("");
  const [pilotDuration, setPilotDuration] = useState("2 weeks");
  const [notes, setNotes] = useState("");
  const [actionTaken, setActionTaken] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDecision = async (status: "Approved" | "Refinement Requested") => {
    if (!ideaId) return;

    try {
      setIsProcessing(true);
      const managerUser = JSON.parse(localStorage.getItem("user") || "{}");

      const decisionId = await generateSequentialId("decisions", "decision_", 3, "decision_id");

      const ideaRef = doc(db, "ideas", ideaId);
      const ideaSnap = await getDoc(ideaRef);
      const ideaData = ideaSnap.data();

      if (!ideaData) throw new Error("Idea not found");

      const employeeRef = doc(db, "users", ideaData.submittedBy || "null");
      const employeeSnap = await getDoc(employeeRef);
      const employeeData = employeeSnap.data();

      await setDoc(doc(db, "decisions", decisionId), {
        decision_id: decisionId,
        idea_id: ideaId,
        pathway: aimpPathway,
        indicative_budget: Number(budget || 0),
        pilot_duration: pilotDuration,
        notes,
        decision_status: status,
        manager_id: managerUser.id || "Unknown",
        employee_id: ideaData.submittedBy || "Unknown",
        createdAt: serverTimestamp(),
      });

      await updateDoc(ideaRef, { status });

      toast.success(
        status === "Approved"
          ? "Email sent: Idea is approved."
          : "Email sent: Idea has been requested for refinement."
      );
      
      setActionTaken(status === "Approved" ? "approved" : "refinement");
    } catch (error) {
      console.error(error);
      toast.error("Failed to process decision. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = () => handleDecision("Approved");
  const handleRefine = () => handleDecision("Refinement Requested");

  if (loading) {
    return <div className="p-10 text-center text-muted-foreground w-full">Loading Idea Details...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button onClick={onBack} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Innovation Portfolio
        </button>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground font-medium">Idea Detail</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content — 2 cols */}
        <div className="xl:col-span-2 space-y-6">
          {/* Title Card */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">{idea.title}</h1>
              <span className={cn(
                "px-2.5 py-1 rounded text-xs font-semibold",
                idea.pathway === "Fast-Track" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
              )}>
                {idea.pathway}
              </span>
            </div>
            <p className="text-muted-foreground text-sm mt-2">
              Submitted by {idea.submittedBy} · {idea.department} · {idea.timeAgo}
            </p>

            <h2 className="text-lg font-bold text-foreground mt-6">Problem Statement</h2>
            <p className="text-muted-foreground mt-2 leading-relaxed">{idea.problemStatement}</p>

            <div className="mt-4 bg-red-50 border border-red-100 rounded-lg p-4 flex flex-col sm:flex-row gap-6">
              <div>
                <p className="text-xs text-muted-foreground">Current Loss (Annual)</p>
                <p className="text-xl font-bold text-red-600 mt-0.5">{idea.currentLoss}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Hours Lost (Weekly)</p>
                <p className="text-xl font-bold text-red-600 mt-0.5">{idea.hoursLost}</p>
              </div>
            </div>
          </div>

          {/* INIE Narrative */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-lg font-bold text-foreground">INIE-Enhanced Narrative</h2>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors">
                <History className="w-4 h-4" />
                View Version History
              </button>
            </div>

            <h3 className="font-bold text-foreground mt-5">Proposed Solution</h3>
            <p className="text-muted-foreground mt-1 leading-relaxed">{idea.proposedSolution}</p>

            <h3 className="font-bold text-foreground mt-5">Expected Value</h3>
            <p className="text-muted-foreground mt-1 leading-relaxed">{idea.expectedValue}</p>

            <h3 className="font-bold text-foreground mt-5">Strategic Alignment</h3>
            <div className="flex gap-2 mt-2">
              {idea.strategicAlignment.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">{tag}</span>
              ))}
            </div>

            <h3 className="font-bold text-foreground mt-5">Risks & Assumptions</h3>
            <p className="text-muted-foreground mt-1 leading-relaxed">{idea.risks}</p>
          </div>

          {/* OIR Lineage */}
          {idea.similarIdeas.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-bold text-foreground">OIR Lineage: Similar Past Ideas</h2>
              <div className="mt-4 space-y-4">
                {idea.similarIdeas.map((si) => (
                  <div key={si.title} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-foreground">{si.title}</h3>
                        <p className="text-xs text-muted-foreground">{si.dept} · {si.similarity} similarity</p>
                      </div>
                      <span className={cn(
                        "px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap",
                        si.status === "Implemented" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      )}>
                        {si.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{si.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* AI Scoring */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-bold text-foreground">AI Scoring Breakdown</h2>
            <div className="text-center mt-4">
              <p className="text-5xl font-extrabold text-primary">{idea.overallScore}</p>
              <p className="text-sm text-muted-foreground mt-1">Overall Score</p>
            </div>
            <div className="mt-6 space-y-4">
              <ScoreProgressBar label="ROI-M" score={idea.roiScore} color="bg-green-500" />
              <ScoreProgressBar label="Feasibility" score={idea.feasibilityScore} color="bg-blue-500" />
              <ScoreProgressBar label="Strategic Fit" score={idea.strategicFitScore} color="bg-purple-500" />
            </div>
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-yellow-800">Assessment: <span className="font-normal">{idea.assessment}</span></p>
            </div>
          </div>

          {/* Team Composition */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-bold text-foreground">Team Composition (SCDS)</h2>
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-700">Team Balance Warning</p>
                <p className="text-xs text-yellow-700 mt-0.5">{idea.teamWarning}</p>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-foreground mt-5">Suggested Collaborator</h3>
            <div className="mt-3 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                {idea.suggestedCollaborator.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{idea.suggestedCollaborator.name}</p>
                <p className="text-xs text-muted-foreground">{idea.suggestedCollaborator.role}</p>
                <p className="text-xs text-muted-foreground mt-1">{idea.suggestedCollaborator.reason}</p>
              </div>
            </div>
            <button className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors">
              <UserPlus className="w-4 h-4" />
              Add to Team
            </button>
          </div>

          {/* Decision Portal */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-bold text-foreground">Decision Portal</h2>

            {actionTaken ? (
              <div className={cn(
                "mt-4 rounded-lg p-4 text-center",
                actionTaken === "approved" ? "bg-green-50 border border-green-200" : "bg-orange-50 border border-orange-200"
              )}>
                <CheckCircle2 className={cn("w-8 h-8 mx-auto", actionTaken === "approved" ? "text-green-600" : "text-orange-600")} />
                <p className={cn("font-semibold mt-2", actionTaken === "approved" ? "text-green-700" : "text-orange-700")}>
                  {actionTaken === "approved" ? "Idea Approved!" : "Refinement Requested"}
                </p>
                <button onClick={() => setActionTaken(null)} className="text-xs text-muted-foreground underline mt-2">Undo</button>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">AIMP Pathway</label>
                  <select value={aimpPathway} onChange={(e) => setAimpPathway(e.target.value)} className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>Fast-Track</option>
                    <option>Deep-Dive</option>
                    <option>Standard</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">Indicative Budget (£)</label>
                  <input type="number" placeholder="e.g. 50000" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">Pilot Duration</label>
                  <select value={pilotDuration} onChange={(e) => setPilotDuration(e.target.value)} className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>2 weeks</option>
                    <option>4 weeks</option>
                    <option>6 weeks</option>
                    <option>8 weeks</option>
                    <option>12 weeks</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">Notes</label>
                  <textarea placeholder="Add any notes or requirements..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                </div>
                <button disabled={isProcessing} onClick={handleApprove} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-foreground text-background rounded-lg text-sm font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-50">
                  <CheckCircle2 className="w-4 h-4" />
                  {isProcessing ? "Processing..." : "Approve Idea"}
                </button>
                <button disabled={isProcessing} onClick={handleRefine} className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-accent transition-colors disabled:opacity-50">
                  <RotateCcw className="w-4 h-4" />
                  Request Refinement
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionPortal;
