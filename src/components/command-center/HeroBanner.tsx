import { Sparkles, X } from "lucide-react";
import { useState } from "react";

const HeroBanner = () => {
  const [showInsights, setShowInsights] = useState(false);

  return (
    <>
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-primary to-primary/80 px-6 py-8 md:px-10 md:py-10 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative flex items-start justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Command Center</h2>
            <p className="text-sm opacity-80 mt-1">Last 30 days · Updated 10 Feb 2026</p>
          </div>
          <button
            onClick={() => setShowInsights(true)}
            className="flex items-center gap-2 bg-card text-card-foreground px-4 py-2 rounded-lg text-sm font-medium hover:shadow-md transition-shadow"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            AI Summary
          </button>
        </div>
      </div>

      {/* Overlay */}
      {showInsights && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowInsights(false)} />
      )}

      {/* Right Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 shadow-2xl transform transition-transform duration-300 ${
          showInsights ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">AI-Generated Insights</h2>
              <p className="text-sm text-muted-foreground mt-1">Key observations and recommendations from the past 30 days</p>
            </div>
            <button onClick={() => setShowInsights(false)} className="p-1 rounded hover:bg-muted transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-5">
            {[
              {
                num: 1,
                color: "text-red-600 bg-red-50",
                title: "Compliance is the top bottleneck this month",
                body: "with an average approval time of 8 days. High friction detected in the Legal/Compliance approval stage.",
              },
              {
                num: 2,
                color: "text-blue-600 bg-blue-50",
                title: "Readiness is high but approvals lag.",
                body: "Innovation velocity is up 32% but time-to-decision has increased. Recommend faster triage process.",
              },
              {
                num: 3,
                color: "text-green-600 bg-green-50",
                title: "Top idea candidates align with Efficiency KPI.",
                body: "Three Fast-Track ideas in Operations show £370k combined annual value.",
              },
            ].map((item) => (
              <div key={item.num} className="flex gap-3">
                <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${item.color}`}>
                  {item.num}
                </span>
                <p className="text-sm text-foreground leading-relaxed">
                  <strong>{item.title}</strong> {item.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-foreground mb-3">Recommended Actions</h3>
            <ul className="space-y-2">
              {[
                "Schedule compliance process review meeting",
                'Fast-track "Inventory Analytics" for immediate pilot',
                "Implement automated compliance pre-screening",
              ].map((action, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroBanner;
