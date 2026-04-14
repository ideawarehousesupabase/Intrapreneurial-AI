import { LayoutDashboard, Lightbulb, GitFork, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileSidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { id: "command-center", label: "Command Center", icon: LayoutDashboard },
  { id: "innovation-portfolio", label: "Innovation Portfolio", icon: Lightbulb },
  { id: "decision-portal", label: "Decision Portal", icon: GitFork },
];

const MobileSidebar = ({ activePage, onNavigate, open, onClose }: MobileSidebarProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-foreground/20" onClick={onClose} />
      <aside className="absolute left-0 top-0 bottom-0 w-64 bg-card border-r border-border shadow-lg">
        <div className="flex items-center justify-between p-6">
          <h1 className="text-lg font-bold text-foreground">Intrapreneurial AI</h1>
          <button onClick={onClose} className="p-1 rounded hover:bg-accent">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); onClose(); }}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                activePage === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default MobileSidebar;
