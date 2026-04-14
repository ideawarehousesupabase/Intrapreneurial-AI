import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { cn } from "@/lib/utils";

const IdeaStatus = () => {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        if (!currentUser.id) return;
        
        const q = query(
          collection(db, "ideas"),
          where("submittedBy", "==", currentUser.id)
        );
        
        const snapshot = await getDocs(q);
        
        const formattedIdeas = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            pathway: data.pathway,
            stage: data.stage,
            status: data.status,
            potentialValue: data.potentialValue,
            submittedAtMs: data.submittedAt?.toMillis() || Date.now()
          };
        }).sort((a, b) => b.submittedAtMs - a.submittedAtMs);
        
        setIdeas(formattedIdeas);
      } catch (error) {
        console.error("Error fetching idea status: ", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIdeas();
  }, [currentUser.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "text-green-700 bg-green-100 border-green-200";
      case "Refinement Requested": return "text-orange-700 bg-orange-100 border-orange-200";
      default: return "text-blue-700 bg-blue-100 border-blue-200";
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Idea Status Portal</h1>
          <p className="text-muted-foreground mt-1 text-sm">Track your submitted intrapreneurial concepts through the organizational pipeline.</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading your ideas...</div>
        ) : ideas.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">You haven't submitted any ideas yet. Get started in the Submit Idea portal!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left px-5 py-4 font-semibold text-foreground">Idea Title</th>
                  <th className="text-left px-5 py-4 font-semibold text-foreground">Pathway</th>
                  <th className="text-left px-5 py-4 font-semibold text-foreground">Stage</th>
                  <th className="text-left px-5 py-4 font-semibold text-foreground">Est. Value (£)</th>
                  <th className="text-left px-5 py-4 font-semibold text-foreground">Date Submitted</th>
                  <th className="text-left px-5 py-4 font-semibold text-foreground">Current Status</th>
                </tr>
              </thead>
              <tbody>
                {ideas.map((idea) => (
                  <tr key={idea.id} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                    <td className="px-5 py-4 font-medium text-foreground">{idea.title}</td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap",
                        idea.pathway === "Fast-Track" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                      )}>
                        {idea.pathway}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{idea.stage}</td>
                    <td className="px-5 py-4 font-semibold text-muted-foreground">
                      {idea.potentialValue ? `£${idea.potentialValue.toLocaleString()}` : "N/A"}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                      {new Date(idea.submittedAtMs).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", getStatusColor(idea.status))}>
                        {idea.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaStatus;
