import { useState } from "react";
import { Search, Download, Filter, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const kpiData = [
  { label: "Total Ideas", value: "6", change: "+12% from last month", positive: true },
  { label: "Active Ideas", value: "6", change: "+8% from last month", positive: true },
  { label: "Avg AI Score", value: "80", change: "-2% from last month", positive: false },
  { label: "Potential Value", value: "£865k", change: "+18% from last month", positive: true },
];

const ideas = [
  {
    id: "inventory-analytics",
    title: "Inventory Analytics",
    department: "Operations",
    submittedBy: "Sarah Mitchell",
    role: "Operations Manager",
    pathway: "Fast-Track",
    stage: "Review",
    aiScore: 87,
    roiScore: 92,
    status: "Pending approval",
    statusColor: "text-orange-600 bg-orange-50 border-orange-200",
    lastActivity: "2 hours ago",
  },
  {
    id: "customer-returns",
    title: "Customer Returns Optimisation",
    department: "Customer Service",
    submittedBy: "James Chen",
    role: "Customer Service Lead",
    pathway: "Deep-Dive",
    stage: "Drafting",
    aiScore: 76,
    roiScore: 71,
    status: "In progress",
    statusColor: "text-blue-600 bg-blue-50 border-blue-200",
    lastActivity: "1 day ago",
  },
  {
    id: "compliance-bot",
    title: "Compliance Bot",
    department: "Legal/Compliance",
    submittedBy: "Emma Thompson",
    role: "Compliance Officer",
    pathway: "Fast-Track",
    stage: "Approval",
    aiScore: 82,
    roiScore: 68,
    status: "Awaiting decision",
    statusColor: "text-red-600 bg-red-50 border-red-200",
    lastActivity: "3 hours ago",
  },
  {
    id: "employee-scheduling",
    title: "Employee Scheduling AI",
    department: "HR",
    submittedBy: "Michael Roberts",
    role: "HR Business Partner",
    pathway: "Deep-Dive",
    stage: "Pilot",
    aiScore: 79,
    roiScore: 77,
    status: "Pilot running",
    statusColor: "text-purple-600 bg-purple-50 border-purple-200",
    lastActivity: "5 hours ago",
  },
  {
    id: "supply-chain",
    title: "Supply Chain Visibility",
    department: "Operations",
    submittedBy: "David Kumar",
    role: "Supply Chain Analyst",
    pathway: "Fast-Track",
    stage: "Review",
    aiScore: 85,
    roiScore: 88,
    status: "Under review",
    statusColor: "text-green-600 bg-green-50 border-green-200",
    lastActivity: "1 day ago",
  },
  {
    id: "sustainability-tracker",
    title: "Sustainability Tracker",
    department: "Finance",
    submittedBy: "Rachel Green",
    role: "Financial Controller",
    pathway: "Deep-Dive",
    stage: "Drafting",
    aiScore: 73,
    roiScore: 65,
    status: "Draft in progress",
    statusColor: "text-gray-600 bg-gray-50 border-gray-200",
    lastActivity: "2 days ago",
  },
];

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-sm">{score}</span>
      <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

interface InnovationPortfolioProps {
  onViewIdea?: (ideaId: string) => void;
}

const InnovationPortfolio = ({ onViewIdea }: InnovationPortfolioProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [pathway, setPathway] = useState("all");
  const [stage, setStage] = useState("all");

  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = department === "all" || idea.department === department;
    const matchesPathway = pathway === "all" || idea.pathway === pathway;
    const matchesStage = stage === "all" || idea.stage === stage;
    return matchesSearch && matchesDept && matchesPathway && matchesStage;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Innovation Portfolio</h1>
          <p className="text-muted-foreground mt-1">Comprehensive view of all ideas across the organisation</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors">
          <Download className="w-4 h-4" />
          Export Portfolio
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <div key={kpi.label} className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
            <p className="text-3xl font-bold text-foreground mt-2">{kpi.value}</p>
            <div className={cn("flex items-center gap-1 mt-3 text-xs font-medium", kpi.positive ? "text-green-600" : "text-red-500")}>
              {kpi.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by idea title or submitter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={department} onChange={(e) => setDepartment(e.target.value)} className="px-3 py-2.5 border border-border rounded-lg bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="all">All Departments</option>
            <option value="Operations">Operations</option>
            <option value="Customer Service">Customer Service</option>
            <option value="Legal/Compliance">Legal/Compliance</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>
          <select value={pathway} onChange={(e) => setPathway(e.target.value)} className="px-3 py-2.5 border border-border rounded-lg bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="all">All Pathways</option>
            <option value="Fast-Track">Fast-Track</option>
            <option value="Deep-Dive">Deep-Dive</option>
          </select>
          <select value={stage} onChange={(e) => setStage(e.target.value)} className="px-3 py-2.5 border border-border rounded-lg bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="all">All Stages</option>
            <option value="Drafting">Drafting</option>
            <option value="Review">Review</option>
            <option value="Approval">Approval</option>
            <option value="Pilot">Pilot</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">Showing {filteredIdeas.length} of {ideas.length} ideas</p>

      {/* Ideas Table */}
      <div className="bg-card rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 font-semibold text-foreground">Idea Title</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Department</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Submitted By</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Pathway</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Stage</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">AI Score</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">ROI Score</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {filteredIdeas.map((idea) => (
              <tr key={idea.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-4">
                  <button
                    onClick={() => onViewIdea?.(idea.id)}
                    className="text-primary font-medium hover:underline text-left"
                  >
                    {idea.title}
                  </button>
                </td>
                <td className="px-4 py-4">
                  <span className="px-2.5 py-1 bg-muted rounded text-xs font-medium text-foreground">{idea.department}</span>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium text-foreground">{idea.submittedBy}</p>
                    <p className="text-xs text-muted-foreground">{idea.role}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded text-xs font-semibold",
                    idea.pathway === "Fast-Track" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  )}>
                    {idea.pathway}
                  </span>
                </td>
                <td className="px-4 py-4 text-foreground">{idea.stage}</td>
                <td className="px-4 py-4">
                  <ScoreBar score={idea.aiScore} color="bg-primary" />
                </td>
                <td className="px-4 py-4">
                  <ScoreBar score={idea.roiScore} color={idea.roiScore >= 80 ? "bg-green-500" : idea.roiScore >= 70 ? "bg-yellow-500" : "bg-orange-500"} />
                </td>
                <td className="px-4 py-4">
                  <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", idea.statusColor)}>
                    {idea.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">{idea.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InnovationPortfolio;
