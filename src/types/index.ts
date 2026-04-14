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
