import React, { useState, useEffect } from "react";
import { collection, getDocs, setDoc, doc, serverTimestamp, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/config/firebase";
import { toast } from "sonner";
import { Eye, EyeOff, Building2, Network, LogOut, ShieldCheck } from "lucide-react";

// ─── Admin Login Screen ───
const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (username === "admin" && password === "1234") {
      onLogin();
    } else {
      setError("Invalid admin credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Admin Console
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Restricted access — authorized personnel only.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 py-8 px-4 shadow-xl rounded-xl sm:px-10">
          {error && <div className="mb-4 text-sm text-red-400 bg-red-900/30 border border-red-800 p-3 rounded-lg">{error}</div>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-300">Username</label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full border border-slate-600 rounded-lg bg-slate-700/50 text-white py-2.5 px-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  placeholder="Enter admin username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full border border-slate-600 rounded-lg bg-slate-700/50 text-white py-2.5 px-3 pr-10 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-slate-900 bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-slate-800 transition-colors"
              >
                Access Admin Panel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ─── Helper: generate next ID for a collection ───
async function generateAdminId(
  collectionName: string,
  prefix: string,
  padding: number
): Promise<string> {
  try {
    // Try ordering by the doc ID field convention used in this project
    // organizations use no explicit id field — we parse from doc IDs
    const snap = await getDocs(collection(db, collectionName));

    if (snap.empty) {
      return `${prefix}${(1).toString().padStart(padding, "0")}`;
    }

    // Parse numeric suffixes from document IDs
    let maxNum = 0;
    snap.docs.forEach((d) => {
      const match = d.id.match(new RegExp(`^${prefix}(\\d+)$`));
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });

    const nextNum = maxNum + 1;
    return `${prefix}${nextNum.toString().padStart(padding, "0")}`;
  } catch {
    return `${prefix}${(1).toString().padStart(padding, "0")}`;
  }
}

// ─── Admin Dashboard ───
const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  // Organization form
  const [orgName, setOrgName] = useState("");
  const [orgLoading, setOrgLoading] = useState(false);

  // Department form
  const [deptName, setDeptName] = useState("");
  const [deptOrgId, setDeptOrgId] = useState("");
  const [deptLoading, setDeptLoading] = useState(false);

  // Orgs list for dropdown
  const [orgs, setOrgs] = useState<{ id: string; name: string }[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);

  const fetchOrgs = async () => {
    try {
      const snap = await getDocs(collection(db, "organizations"));
      const list = snap.docs.map((d) => ({ id: d.id, name: d.data().name || d.id }));
      list.sort((a, b) => a.id.localeCompare(b.id));
      setOrgs(list);
    } catch {
      setOrgs([]);
    } finally {
      setLoadingOrgs(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const handleAddOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) {
      toast.error("Organization name is required.");
      return;
    }

    setOrgLoading(true);
    try {
      const newId = await generateAdminId("organizations", "org_", 3);
      await setDoc(doc(db, "organizations", newId), {
        name: orgName.trim(),
        createdAt: serverTimestamp(),
      });
      toast.success(`Organization "${orgName.trim()}" added as ${newId}`);
      setOrgName("");
      await fetchOrgs(); // refresh dropdown
    } catch (err) {
      console.error(err);
      toast.error("Failed to add organization.");
    } finally {
      setOrgLoading(false);
    }
  };

  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim()) {
      toast.error("Department name is required.");
      return;
    }
    if (!deptOrgId) {
      toast.error("Please select an organization.");
      return;
    }

    setDeptLoading(true);
    try {
      const newId = await generateAdminId("departments", "dept_", 3);
      await setDoc(doc(db, "departments", newId), {
        name: deptName.trim(),
        organizationId: deptOrgId,
      });
      toast.success(`Department "${deptName.trim()}" added as ${newId}`);
      setDeptName("");
      setDeptOrgId("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add department.");
    } finally {
      setDeptLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Top bar */}
      <div className="border-b border-slate-700 bg-slate-800/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Console</h1>
              <p className="text-xs text-slate-400">Manage organizations & departments</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── Add Organization Card ── */}
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden shadow-lg">
            <div className="px-6 py-5 border-b border-slate-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Add Organization</h2>
                <p className="text-xs text-slate-400">Create a new organization entity</p>
              </div>
            </div>
            <form onSubmit={handleAddOrg} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Organization Name</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g., Northbridge Retail UK"
                  className="block w-full border border-slate-600 rounded-lg bg-slate-700/50 text-white py-2.5 px-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={orgLoading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-colors"
              >
                {orgLoading ? "Adding..." : "Add Organization"}
              </button>
            </form>

            {/* Existing orgs list */}
            {orgs.length > 0 && (
              <div className="px-6 pb-6">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Existing Organizations</p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin">
                  {orgs.map((o) => (
                    <div key={o.id} className="flex items-center justify-between px-3 py-2 bg-slate-700/40 rounded-lg text-sm">
                      <span className="text-slate-200">{o.name}</span>
                      <span className="text-xs text-slate-500 font-mono">{o.id}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Add Department Card ── */}
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden shadow-lg">
            <div className="px-6 py-5 border-b border-slate-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <Network className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Add Department</h2>
                <p className="text-xs text-slate-400">Assign a department to an organization</p>
              </div>
            </div>
            <form onSubmit={handleAddDept} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Department Name</label>
                <input
                  type="text"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="e.g., Operations"
                  className="block w-full border border-slate-600 rounded-lg bg-slate-700/50 text-white py-2.5 px-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Organization</label>
                {loadingOrgs ? (
                  <p className="text-sm text-slate-500">Loading organizations...</p>
                ) : (
                  <select
                    value={deptOrgId}
                    onChange={(e) => setDeptOrgId(e.target.value)}
                    className="block w-full border border-slate-600 rounded-lg bg-slate-700/50 text-white py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Organization...</option>
                    {orgs.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} ({o.id})
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <button
                type="submit"
                disabled={deptLoading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors"
              >
                {deptLoading ? "Adding..." : "Add Department"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

// ─── Main Admin Page (manages auth state internally) ───
const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return isAuthenticated ? (
    <AdminDashboard onLogout={() => setIsAuthenticated(false)} />
  ) : (
    <AdminLogin onLogin={() => setIsAuthenticated(true)} />
  );
};

export default AdminPanel;
