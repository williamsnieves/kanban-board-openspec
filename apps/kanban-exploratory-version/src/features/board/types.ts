export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  author: string;
}

export interface Subtask {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface ActivityLog {
  id: string;
  action: 'comment' | 'move' | 'priority' | 'create' | 'update';
  details: string;
  timestamp: string;
  author: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  labels?: string[];
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  comments: Comment[];
  subtasks: Subtask[];
  activityLog: ActivityLog[];
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
  // createdAt: stored as Unix timestamp (ms); ISO string fields (dueDate, Comment.createdAt, ActivityLog.timestamp) survive JSON round-trip as-is
  createdAt: number;
}
