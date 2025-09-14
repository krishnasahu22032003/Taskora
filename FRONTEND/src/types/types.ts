export interface Task {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high" | string;
  completed?: boolean | number | string;
  dueDate?: string;
  subtasks?: { title: string; completed: boolean }[];
  [key: string]: any;
}