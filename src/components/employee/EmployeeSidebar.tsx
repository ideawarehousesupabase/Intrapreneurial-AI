import { NavLink } from "react-router-dom";
import { PlusCircle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const EmployeeSidebar = () => {
  return (
    <aside className="w-64 border-r border-border bg-card hidden lg:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
          <span className="text-primary-foreground font-bold text-xl leading-none">I</span>
        </div>
        <span className="font-bold text-lg text-foreground tracking-tight">Intrapreneurial</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Ideation Workspace</p>
        
        <NavLink
          to="/employee/submit-idea"
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
            isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          <PlusCircle className="w-5 h-5" />
          Submit Idea
        </NavLink>

        <NavLink
          to="/employee/idea-status"
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
            isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          <Activity className="w-5 h-5" />
          Idea Status
        </NavLink>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-accent/50 rounded-lg p-4 relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-sm font-semibold text-foreground">Need help structuring?</h4>
            <p className="text-xs text-muted-foreground mt-1 mb-3">Check the INIE-Enhanced format documents.</p>
            <button className="text-xs font-medium text-primary bg-background shadow-sm border border-border px-3 py-1.5 rounded-md hover:bg-accent transition-colors w-full cursor-pointer">
              Read Guidelines
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default EmployeeSidebar;
