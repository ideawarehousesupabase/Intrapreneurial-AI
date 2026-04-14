import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase";

const EmployeeIdeaForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [proposedSolution, setProposedSolution] = useState("");
  const [expectedValue, setExpectedValue] = useState("");
  const [strategicAlignment, setStrategicAlignment] = useState("");
  const [risksAssumptions, setRisksAssumptions] = useState("");
  const [potentialValue, setPotentialValue] = useState<number | "">("");
  const [pathway, setPathway] = useState<"Fast-Track" | "Deep-Dive" | "">("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!title || !problemStatement || !proposedSolution || !expectedValue || !strategicAlignment || !risksAssumptions || !potentialValue || !pathway) {
      setError("Please fill in all required fields.");
      return;
    }

    if (Number(potentialValue) <= 0) {
      setError("Potential Value must be a positive number.");
      return;
    }

    if (!user.id || !user.departmentId || !user.organizationId) {
      setError("User session is invalid. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create Idea Document
      const ideaRef = await addDoc(collection(db, "ideas"), {
        title,
        departmentId: user.departmentId,
        organizationId: user.organizationId,
        submittedBy: user.id,
        pathway,
        stage: "Drafting",
        status: "Draft in progress",
        aiScore: 0,
        roiScore: 0,
        feasibilityScore: 0,
        strategicFitScore: 0,
        potentialValue: Number(potentialValue),
        submittedAt: serverTimestamp(),
      });

      // 2. Create Initial Stage History
      await addDoc(collection(db, "idea_stage_history"), {
        ideaId: ideaRef.id,
        stage: "Drafting",
        enteredAt: serverTimestamp(),
        exitedAt: null,
      });

      // 3. Create INIE-Enhanced Narrative
      await addDoc(collection(db, "inie_narratives"), {
        idea_id: ideaRef.id,
        problem_statement: problemStatement,
        proposed_solution: proposedSolution,
        expected_value: expectedValue,
        strategic_alignment: strategicAlignment,
        risks_assumptions: risksAssumptions,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      
      // Reset form
      setTitle("");
      setProblemStatement("");
      setProposedSolution("");
      setExpectedValue("");
      setStrategicAlignment("");
      setRisksAssumptions("");
      setPotentialValue("");
      setPathway("");

    } catch (err: any) {
      console.error(err);
      setError("Failed to submit idea. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, value, onChange, type = "text", placeholder = "" }: any) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
      />
    </div>
  );

  const TextAreaField = ({ label, value, onChange, placeholder = "" }: any) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-6 bg-indigo-600 text-white">
          <h2 className="text-2xl font-bold">Submit a New Idea</h2>
          <p className="mt-2 text-indigo-100 text-sm">
            Launch your concept with our structured INIE-Enhanced methodology.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="px-8 py-8">
          
          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              Your idea has been successfully submitted and is now entering the Drafting stage!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <div className="md:col-span-2">
              <InputField label="Idea Title" value={title} onChange={setTitle} placeholder="e.g., Automated Supply Chain Monitoring" />
            </div>

            <div className="md:col-span-2">
              <TextAreaField label="Problem Statement" value={problemStatement} onChange={setProblemStatement} placeholder="What business problem does this solve?" />
            </div>

            <div className="md:col-span-2">
              <TextAreaField label="Proposed Solution" value={proposedSolution} onChange={setProposedSolution} placeholder="How does your idea solve the problem?" />
            </div>

            <div className="md:col-span-2">
              <TextAreaField label="Expected Value" value={expectedValue} onChange={setExpectedValue} placeholder="What are the expected qualitative impacts?" />
            </div>

            <div className="md:col-span-2">
              <TextAreaField label="Risks & Assumptions" value={risksAssumptions} onChange={setRisksAssumptions} placeholder="What potential risks or dependencies exist?" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Strategic Alignment</label>
              <select
                value={strategicAlignment}
                onChange={(e) => setStrategicAlignment(e.target.value)}
                className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
              >
                <option value="">Select Alignment...</option>
                <option value="Efficiency">Efficiency</option>
                <option value="Revenue Growth">Revenue Growth</option>
                <option value="Cost Reduction">Cost Reduction</option>
                <option value="Sustainability">Sustainability</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Pathway Selection</label>
              <select
                value={pathway}
                onChange={(e) => setPathway(e.target.value as any)}
                className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
              >
                <option value="">Select Pipeline...</option>
                <option value="Fast-Track">Fast-Track</option>
                <option value="Deep-Dive">Deep-Dive</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <InputField type="number" label="Estimated Potential Value (£)" value={potentialValue} onChange={setPotentialValue} placeholder="Ex: 50000" />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 mt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Concept"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EmployeeIdeaForm;
