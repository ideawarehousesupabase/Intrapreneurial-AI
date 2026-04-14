export interface User {
  id?: string;
  name: string;
  jobTitle: string;
  departmentId: string;
  organizationId: string;
  email: string;
  passwordHash: string;
  role: "Employee" | "Manager";
  createdAt: any; // Firestore Timestamp
}

export interface Department {
  id: string;
  name: string;
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
}

export interface Idea {
  id?: string;
  title: string;
  departmentId: string;
  organizationId: string;
  submittedBy: string; // user id
  pathway: "Fast-Track" | "Deep-Dive";
  stage: "Drafting";
  status: "Draft in progress";
  aiScore: number; // default 0
  roiScore: number; // default 0
  feasibilityScore: number; // default 0
  strategicFitScore: number; // default 0
  potentialValue: number;
  submittedAt: any; // Firestore Timestamp
}

export interface IdeaStageHistory {
  id?: string;
  ideaId: string;
  stage: "Drafting";
  enteredAt: any; // Firestore Timestamp
  exitedAt: null;
}

export interface INIENarrative {
  narrative_id?: string;
  idea_id: string;
  problem_statement: string;
  proposed_solution: string;
  expected_value: string;
  strategic_alignment: string;
  risks_assumptions: string;
  createdAt: any; // Firestore Timestamp
}

export interface Decision {
  decision_id: string; // e.g., decision_001
  idea_id: string;
  pathway: "Fast-Track" | "Deep-Dive";
  indicative_budget: number;
  pilot_duration: string;
  notes: string;
  decision_status: "Approved" | "Refinement Requested";
  manager_id: string;
  employee_id: string;
  createdAt: any; // Firestore Timestamp
}
