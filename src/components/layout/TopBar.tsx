import { Search, Bell, ChevronDown, Menu, Building2, LogOut, Settings, User, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
interface TopBarProps {
  onMenuToggle?: () => void;
}


const notifications = [
  { id: 1, text: "New idea submitted by Marketing team", time: "2m ago", read: false },
  { id: 2, text: "AI scoring complete for Project Atlas", time: "15m ago", read: false },
  { id: 3, text: "Budget approval needed for Q3 initiative", time: "1h ago", read: true },
  { id: 4, text: "Innovation sprint starts tomorrow", time: "3h ago", read: true },
];

const TopBar = ({ onMenuToggle }: TopBarProps) => {
  const [companyOpen, setCompanyOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeCompany, setActiveCompany] = useState("org_001");
  const [companies, setCompanies] = useState([{ id: "org_001", name: "Loading..." }]);

  const companyRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (companyRef.current && !companyRef.current.contains(e.target as Node)) setCompanyOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "organizations"));
        if (!querySnapshot.empty) {
          const orgData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name || doc.id
          }));
          setCompanies(orgData);
          if (!orgData.find(o => o.id === activeCompany) && orgData.length > 0) {
            setActiveCompany(orgData[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
      }
    };
    fetchOrganizations();
  }, [activeCompany]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const selected = companies.find((c) => c.id === activeCompany) || companies[0];

  return (
    <header className="flex items-center justify-between px-4 lg:px-6 h-16 border-b border-border bg-card sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-md hover:bg-accent">
          <Menu className="w-5 h-5 text-foreground" />
        </button>

        {/* Company Switcher */}
        <div ref={companyRef} className="relative">
          <button
            onClick={() => { setCompanyOpen(!companyOpen); setNotifOpen(false); setProfileOpen(false); }}
            className="flex items-center gap-2 text-sm font-medium text-foreground px-3 py-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <Building2 className="w-4 h-4 text-primary" />
            {selected.name}
            <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", companyOpen && "rotate-180")} />
          </button>
          {companyOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 rounded-lg border border-border bg-card shadow-lg py-1 z-50 animate-in fade-in-0 zoom-in-95">
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Switch Organisation</p>
              {companies.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setActiveCompany(c.id); setCompanyOpen(false); }}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                >
                  <span>{c.name}</span>
                  {c.id === activeCompany && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ideas, teams, insights..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setCompanyOpen(false); setProfileOpen(false); }}
            className="relative p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute top-full right-0 mt-1 w-80 rounded-lg border border-border bg-card shadow-lg z-50 animate-in fade-in-0 zoom-in-95">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground">Notifications</p>
                <span className="text-xs text-primary font-medium cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={cn("px-4 py-3 border-b border-border last:border-0 hover:bg-accent/50 transition-colors cursor-pointer", !n.read && "bg-primary/5")}>
                    <p className="text-sm text-foreground">{n.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setCompanyOpen(false); setNotifOpen(false); }}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              JD
            </div>
            <span className="hidden md:block text-sm font-medium text-foreground">Manager</span>
            <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", profileOpen && "rotate-180")} />
          </button>
          {profileOpen && (
            <div className="absolute top-full right-0 mt-1 w-52 rounded-lg border border-border bg-card shadow-lg py-1 z-50 animate-in fade-in-0 zoom-in-95">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-medium text-foreground">John Doe</p>
                <p className="text-xs text-muted-foreground">john@northbridge.co.uk</p>
              </div>
              <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                <User className="w-4 h-4" /> Profile
              </button>
              <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                <Settings className="w-4 h-4" /> Settings
              </button>
              <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-accent transition-colors">
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
