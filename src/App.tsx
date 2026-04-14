import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ManagerLayout from "./pages/Index.tsx";
import CommandCenter from "./pages/CommandCenter.tsx";
import InnovationPortfolio from "./pages/InnovationPortfolio.tsx";
import DecisionPortal from "./pages/DecisionPortal.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ChangePassword from "./components/auth/ChangePassword";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import EmployeeIdeaForm from "./components/employee/EmployeeIdeaForm";
import EmployeeDashboard from "./components/employee/EmployeeDashboard";
import IdeaStatus from "./components/employee/IdeaStatus";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route
            element={
              <ProtectedRoute role="Manager">
                <ManagerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<CommandCenter />} />
            <Route path="/command-center" element={<CommandCenter />} />
            <Route path="/innovation-portfolio" element={<InnovationPortfolio />} />
            <Route path="/decision-portal" element={<DecisionPortal />} />
            <Route path="/decision-portal/:ideaId" element={<DecisionPortal />} />
          </Route>

          <Route
            element={
              <ProtectedRoute role="Employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="/employee/submit-idea" element={<EmployeeIdeaForm />} />
            <Route path="/employee/idea-status" element={<IdeaStatus />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
