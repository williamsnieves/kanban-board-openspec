import type { Board } from './types';

const DEFAULT_COLUMNS = ['Todo', 'Doing', 'Done'] as const;

export function createBoard(name: string): Board {
  const boardId = crypto.randomUUID();
  return {
    id: boardId,
    name,
    createdAt: new Date().toISOString(),
    columns: DEFAULT_COLUMNS.map((colName, index) => ({
      id: crypto.randomUUID(),
      name: colName,
      position: index,
      boardId,
      tasks: [],
    })),
  };
}
