import { cn } from "@/lib/utils";

const getColor = (days: number) => {
  if (days <= 2) return "bg-heatmap-low text-success-foreground";
  if (days <= 4) return "bg-heatmap-medium text-warning-foreground";
  if (days <= 6) return "bg-heatmap-high text-warning-foreground";
  return "bg-heatmap-critical text-danger-foreground";
};

const data = [
  { dept: "Operations", drafting: 2, review: 3, approval: 4, pilot: 3 },
  { dept: "Legal/Com...", drafting: 5, review: 6, approval: 8, pilot: 5 },
  { dept: "IT", drafting: 3, review: 4, approval: 5, pilot: 4 },
  { dept: "HR", drafting: 2, review: 3, approval: 4, pilot: 3 },
  { dept: "Finance", drafting: 3, review: 4, approval: 5, pilot: 4 },
];

const stages = ["Drafting", "Review", "Approval", "Pilot"];

const FrictionHeatmap = () => {
  return (
    <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
      <h3 className="text-lg font-bold text-card-foreground">IFH Friction Heatmap</h3>
      <p className="text-sm text-muted-foreground mb-4">Average days in stage by department</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Department</th>
              {stages.map((s) => (
                <th key={s} className="text-center font-medium text-muted-foreground pb-3 px-2">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.dept}>
                <td className="py-1.5 pr-4 font-medium text-card-foreground">{row.dept}</td>
                {[row.drafting, row.review, row.approval, row.pilot].map((val, i) => (
                  <td key={i} className="py-1.5 px-2">
                    <div className={cn("rounded-md py-2 text-center font-bold text-sm", getColor(val))}>
                      {val}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-heatmap-low" /> Low (1-2 days)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-heatmap-medium" /> Medium (3-4 days)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-heatmap-high" /> High (5-6 days)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-heatmap-critical" /> Critical (7+ days)</span>
      </div>
    </div>
  );
};

export default FrictionHeatmap;
