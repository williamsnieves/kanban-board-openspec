export interface Task {
  id: string;
  title: string;
  description?: string;
  labels?: string[];
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface Column {
  id: string;
  name: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
  createdAt: number;
}
