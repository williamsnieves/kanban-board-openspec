export interface Task {
  id: string;
  title: string;
  description?: string;
  position: number;
  columnId: string;
}

export interface Column {
  id: string;
  name: string;
  position: number;
  boardId: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
  createdAt: string;
}
