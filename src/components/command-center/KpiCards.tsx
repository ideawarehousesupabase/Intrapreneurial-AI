import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: { value: string; positive: boolean };
  chart?: React.ReactNode;
  bar?: React.ReactNode;
}

const KpiCard = ({ title, value, subtitle, trend, chart, bar }: KpiCardProps) => (
  <div className="bg-card rounded-xl border border-border p-5 animate-fade-in">
    <p className="text-sm text-muted-foreground font-medium">{title}</p>
    <p className="text-3xl font-bold text-card-foreground mt-2">{value}</p>
    {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    {trend && (
      <p className={`flex items-center gap-1 text-sm font-medium mt-2 ${trend.positive ? "text-success" : "text-danger"}`}>
        {trend.positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        {trend.value}
      </p>
    )}
    {bar && <div className="mt-3">{bar}</div>}
    {chart && <div className="mt-3 h-12">{chart}</div>}
  </div>
);

const MiniLine = ({ color, trend }: { color: string; trend: "up" | "flat" }) => (
  <svg viewBox="0 0 120 40" className="w-full h-full" preserveAspectRatio="none">
    <path
      d={trend === "up"
        ? "M0,35 Q20,32 40,28 T80,18 T120,5"
        : "M0,22 Q30,20 60,21 T120,19"}
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

const ReadinessBar = () => (
  <div className="space-y-1">
    <div className="flex h-3 rounded-full overflow-hidden">
      <div className="bg-warning w-[55%]" />
      <div className="bg-success w-[20%]" />
      <div className="bg-secondary w-[25%]" />
    </div>
    <p className="text-xs text-muted-foreground">72/100 · Strong idea generation, needs faster execution</p>
  </div>
);

const KpiCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <KpiCard
        title="DIRI Readiness Index"
        value="High Energy"
        subtitle="Low Execution"
        bar={<ReadinessBar />}
      />
      <KpiCard
        title="ITRI Trust Index"
        value="82"
        trend={{ value: "↑ 5% vs last month", positive: true }}
        chart={<MiniLine color="hsl(220, 80%, 50%)" trend="flat" />}
      />
      <KpiCard
        title="Innovation Velocity"
        value="32"
        trend={{ value: "↑ 32% vs last month", positive: true }}
        chart={<MiniLine color="hsl(142, 72%, 42%)" trend="up" />}
      />
      <KpiCard
        title="Time-to-Decision"
        value="12 days"
        trend={{ value: "↓ 8% vs last month", positive: true }}
      />
      <KpiCard
        title="Participation Rate"
        value="46%"
        subtitle="of workforce engaged"
      />
      <KpiCard
        title="ROI-M Pipeline"
        value="£450k"
        subtitle="Total opportunity estimate"
      />
    </div>
  );
};

export default KpiCards;
