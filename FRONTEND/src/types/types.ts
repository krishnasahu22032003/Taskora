// src/types/types.ts

export interface SubTask {
  title: string;
  completed: boolean;
}
export interface User {
    id?: string;
  email: string;
  name?: string;
  avatar?: string;
  token?: string; // optional, if backend returns a token
}
export interface BaseTask {
  title: string;
  description: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  subtasks?: SubTask[];
  createdAt?: string;   // <-- ADDED: optional createdAt (ISO string)
}

// Backend representation (DB / API)
export interface Task extends BaseTask {
  id?: string;
  _id?: string;
  completed: "Yes" | "No";
}

// Frontend representation (UI state)
export interface FrontendTask extends BaseTask {
  id?: string;          // use string id (no null) to avoid type issues
  completed: boolean; // boolean in UI
}
