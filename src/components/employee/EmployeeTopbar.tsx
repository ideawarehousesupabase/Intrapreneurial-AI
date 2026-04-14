import { LogOut, Settings, User, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const EmployeeTopbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="flex items-center justify-between px-4 lg:px-6 h-16 border-b border-border bg-card sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-foreground">Intrapreneurial AI</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              {getInitials(user.name)}
            </div>
            <span className="hidden md:block text-sm font-medium text-foreground truncate max-w-[150px]">{user.name || "User"}</span>
            <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", profileOpen && "rotate-180")} />
          </button>
          
          {profileOpen && (
            <div className="absolute top-full right-0 mt-1 w-52 rounded-lg border border-border bg-card shadow-lg py-1 z-50 animate-in fade-in-0 zoom-in-95">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-medium text-foreground">{user.name || "Unknown User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email || ""}</p>
              </div>
              <button type="button" className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors cursor-pointer">
                <User className="w-4 h-4" /> Profile
              </button>
              <button type="button" className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-accent cursor-default transition-colors">
                <Settings className="w-4 h-4" /> Settings
              </button>
              <button 
                type="button"
                onClick={() => {
                  localStorage.removeItem("user");
                  navigate("/");
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-accent transition-colors">
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default EmployeeTopbar;
