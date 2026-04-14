import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { collection, getDocs, query, where, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Department, Organization } from "@/types";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<"Employee" | "Manager">("Employee");
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [departments, setDepartments] = useState<Department[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch departments and organizations on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgSnap = await getDocs(collection(db, "organizations"));
        const orgsData = orgSnap.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Organization, "id">)
        }));
        setOrganizations(orgsData);

        const deptSnap = await getDocs(collection(db, "departments"));
        const deptsData = deptSnap.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Department, "id">)
        }));
        setDepartments(deptsData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // Force job title to Manager if role is Manager
  useEffect(() => {
    if (role === "Manager") {
      setJobTitle("Manager");
    } else {
      setJobTitle("");
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basic validations
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!name || !departmentId || !organizationId || !email) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      // 1. Ensure email is unique
      const emailQuery = query(collection(db, "users"), where("email", "==", email));
      const emailSnap = await getDocs(emailQuery);
      if (!emailSnap.empty) {
        setError("Email is already in use.");
        setLoading(false);
        return;
      }

      // 2. Fetch all users to determine next auto-increment ID
      const usersSnap = await getDocs(collection(db, "users"));
      let maxIdNum = 0;
      usersSnap.forEach(userDoc => {
        const match = userDoc.id.match(/^user_(\d+)$/);
        if (match) {
          const num = parseInt(match[1]);
          if (num > maxIdNum) maxIdNum = num;
        }
      });
      maxIdNum++;
      const newUserId = `user_${maxIdNum.toString().padStart(3, "0")}`; // formats to user_001

      // 3. Hash password using bcryptjs
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // 4. Store user document securely
      await setDoc(doc(db, "users", newUserId), {
        id: newUserId,
        name,
        jobTitle,
        departmentId,
        organizationId,
        email,
        passwordHash,
        role,
        createdAt: serverTimestamp()
      });

      // Redirect to login page on success
      navigate("/");

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create an account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Role</label>
              <div className="mt-2 flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="Employee"
                    checked={role === "Employee"}
                    onChange={() => setRole("Employee")}
                    className="h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Employee</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="Manager"
                    checked={role === "Manager"}
                    onChange={() => setRole("Manager")}
                    className="h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Manager</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  disabled={role === "Manager"}
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 disabled:bg-gray-100 disabled:text-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Organization</label>
              <div className="mt-1">
                <select
                  required
                  value={organizationId}
                  onChange={(e) => setOrganizationId(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                >
                  <option value="">Select Organization</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <div className="mt-1">
                <select
                  required
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                >
                  <option value="">Select Department</option>
                  {departments
                    // Assuming you might want to filter depts by org, but per prompt we just show them
                    .filter(d => !organizationId || d.organizationId === organizationId)
                    .map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in Document Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
