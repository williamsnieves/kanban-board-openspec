export interface Task {
  id: string;
  title: string;
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
