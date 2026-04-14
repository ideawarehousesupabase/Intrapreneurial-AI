import { LayoutDashboard, Lightbulb, GitFork } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: "command-center", label: "Command Center", icon: LayoutDashboard },
  { id: "innovation-portfolio", label: "Innovation Portfolio", icon: Lightbulb },
  { id: "decision-portal", label: "Decision Portal", icon: GitFork },
];

const Sidebar = ({ activePage, onNavigate }: SidebarProps) => {
  return (
    <aside className="hidden lg:flex flex-col w-60 border-r border-border bg-card h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-lg font-bold text-foreground tracking-tight">Intrapreneurial AI</h1>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            style={{ display: item.id !== "command-center" ? "none" : undefined }}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
              activePage === item.id
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
