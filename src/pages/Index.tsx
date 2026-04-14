import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import MobileSidebar from "@/components/layout/MobileSidebar";
import CommandCenter from "@/pages/CommandCenter";
import InnovationPortfolio from "@/pages/InnovationPortfolio";
import DecisionPortal from "@/pages/DecisionPortal";

const Index = () => {
  const [activePage, setActivePage] = useState("command-center");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);

  const handleNavigate = (page: string) => {
    setActivePage(page);
    setSelectedIdeaId(null);
  };

  const handleViewIdea = (ideaId: string) => {
    setSelectedIdeaId(ideaId);
    setActivePage("decision-portal");
  };

  const handleBackToPortfolio = () => {
    setSelectedIdeaId(null);
    setActivePage("innovation-portfolio");
  };

  const renderPage = () => {
    switch (activePage) {
      case "command-center":
        return <CommandCenter />;
      case "innovation-portfolio":
        return <InnovationPortfolio onViewIdea={handleViewIdea} />;
      case "decision-portal":
        return <DecisionPortal ideaId={selectedIdeaId || undefined} onBack={handleBackToPortfolio} />;
      default:
        return <CommandCenter />;
    }
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
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default Index;
