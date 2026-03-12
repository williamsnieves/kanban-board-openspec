import type { Board } from './types';

const STORAGE_KEY = 'flowboard-state';

export function saveState(boards: Board[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
  } catch {
    // Ignore write errors (e.g. private browsing quota)
  }
}

export function loadState(): Board[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    let boards = JSON.parse(raw) as Board[];
    // Default priority to 'medium' for legacy tasks lacking this field
    boards = boards.map(board => ({
      ...board,
      columns: board.columns.map(col => ({
        ...col,
        tasks: col.tasks.map(task => ({
          ...task,
          priority: (task as { priority?: string }).priority ?? 'medium',
        })),
      })),
    }));
    return boards;
  } catch {
    return null;
  }
}
