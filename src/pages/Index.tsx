import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import MobileSidebar from "@/components/layout/MobileSidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const ManagerLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Parse path base for sidebar active state marking (e.g. "command-center" from "/command-center")
  const pathParts = location.pathname.split("/");
  const activePage = pathParts[1] || "command-center";

  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
    setMobileOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <MobileSidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuToggle={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;
