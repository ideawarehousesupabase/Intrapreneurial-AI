import { cn } from "@/lib/utils";

interface Idea {
  name: string;
  department: string;
  aiScore: number;
  pathway: string;
  pathwayColor: string;
  stage: string;
  scores: string;
}

const ideas: Idea[] = [
  { name: "Inventory Analytics", department: "Operations", aiScore: 87, pathway: "Fast-Track", pathwayColor: "bg-success/15 text-success", stage: "Review", scores: "R:92 F:85 S:84" },
  { name: "Customer Returns Optimisation", department: "Customer Service", aiScore: 76, pathway: "Deep-Dive", pathwayColor: "bg-primary/15 text-primary", stage: "Drafting", scores: "R:71 F:82 S:75" },
  { name: "Compliance Bot", department: "Legal/Compliance", aiScore: 82, pathway: "Fast-Track", pathwayColor: "bg-success/15 text-success", stage: "Approval", scores: "R:68 F:88 S:90" },
  { name: "Employee Scheduling AI", department: "HR", aiScore: 79, pathway: "Deep-Dive", pathwayColor: "bg-primary/15 text-primary", stage: "Pilot", scores: "R:77 F:81 S:79" },
  { name: "Supply Chain Visibility", department: "Operations", aiScore: 85, pathway: "Fast-Track", pathwayColor: "bg-success/15 text-success", stage: "Review", scores: "R:88 F:80 S:87" },
  { name: "Sustainability Tracker", department: "Finance", aiScore: 73, pathway: "Deep-Dive", pathwayColor: "bg-primary/15 text-primary", stage: "Drafting", scores: "R:55 F:78 S:76" },
];

const PortfolioSnapshot = () => {
  return (
    <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
      <h3 className="text-lg font-bold text-card-foreground">Innovation Portfolio Snapshot</h3>
      <p className="text-sm text-muted-foreground mb-4">Top 6 ideas by AI score</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="pb-3 pr-4 font-medium">Idea</th>
              <th className="pb-3 pr-4 font-medium">Department</th>
              <th className="pb-3 pr-2 font-medium text-center">AI Score</th>
              <th className="pb-3 pr-2 font-medium hidden md:table-cell">Scores</th>
              <th className="pb-3 pr-2 font-medium">Pathway</th>
              <th className="pb-3 font-medium">Stage</th>
            </tr>
          </thead>
          <tbody>
            {ideas.map((idea) => (
              <tr key={idea.name} className="border-t border-border">
                <td className="py-3 pr-4 font-semibold text-card-foreground">{idea.name}</td>
                <td className="py-3 pr-4 text-muted-foreground">{idea.department}</td>
                <td className="py-3 pr-2 text-center font-bold text-card-foreground">{idea.aiScore}</td>
                <td className="py-3 pr-2 text-xs text-muted-foreground hidden md:table-cell">{idea.scores}</td>
                <td className="py-3 pr-2">
                  <span className={cn("px-2 py-1 rounded-full text-xs font-medium", idea.pathwayColor)}>
                    {idea.pathway}
                  </span>
                </td>
                <td className="py-3 text-muted-foreground">{idea.stage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioSnapshot;
