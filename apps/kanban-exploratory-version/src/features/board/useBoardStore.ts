import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Board, Column, Task } from '@/features/board/types';
import { PROTECTED_COLUMN_NAMES, validateColumnName } from '@/features/board/columnValidation';
import { normalizeColumns } from '@/features/board/normalizeColumns';

const DEFAULT_COLUMNS = [
  { id: 'todo', name: 'Todo', tasks: [] },
  { id: 'doing', name: 'Doing', tasks: [] },
  { id: 'done', name: 'Done', tasks: [] },
];

interface BoardStore {
  boards: Board[];
  currentBoardId: string | null;
  createBoard: (name: string) => Board | null;
  loadBoards: () => Board[];
  setCurrentBoard: (id: string) => void;
  getCurrentBoard: () => Board | undefined;
  createCard: (boardId: string, columnId: string, title: string) => Task | null;
  editCard: (boardId: string, columnId: string, cardId: string, title: string) => boolean;
  deleteCard: (boardId: string, columnId: string, cardId: string) => void;
  moveCard: (boardId: string, fromColumnId: string, toColumnId: string, cardId: string) => void;
  createColumn: (boardId: string, name: string) => string | null;
  renameColumn: (boardId: string, columnId: string, newName: string) => string | null;
  deleteColumn: (boardId: string, columnId: string) => string | null;
  reorderColumn: (boardId: string, fromIndex: number, toIndex: number) => string | null;
  reorderTask: (boardId: string, columnId: string, sourceIndex: number, destinationIndex: number) => string | null;
}

export const useBoardStore = create<BoardStore>()(
  persist(
    (set, get) => ({
      boards: [],
      currentBoardId: null,

      createBoard: (name: string): Board | null => {
        if (!name || !name.trim()) {
          return null;
        }
        const newBoard: Board = {
          id: crypto.randomUUID(),
          name: name.trim(),
          columns: DEFAULT_COLUMNS.map((col) => ({ ...col, tasks: [] })),
          createdAt: Date.now(),
        };
        set((state) => ({ boards: [...state.boards, newBoard] }));
        return newBoard;
      },

      loadBoards: (): Board[] => {
        return get().boards;
      },

      setCurrentBoard: (id: string) => {
        set({ currentBoardId: id });
      },

      getCurrentBoard: () => {
        const { boards, currentBoardId } = get();
        return boards.find((b) => b.id === currentBoardId);
      },

      createCard: (boardId: string, columnId: string, title: string): Task | null => {
        if (title.trim().length < 1) return null;
        const newTask: Task = { id: crypto.randomUUID(), title: title.trim() };
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id !== boardId
              ? board
              : {
                  ...board,
                  columns: board.columns.map((col) =>
                    col.id !== columnId
                      ? col
                      : { ...col, tasks: [...col.tasks, newTask] }
                  ),
                }
          ),
        }));
        return newTask;
      },

      editCard: (boardId: string, columnId: string, cardId: string, title: string): boolean => {
        if (title.trim().length < 1) return false;
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id !== boardId
              ? board
              : {
                  ...board,
                  columns: board.columns.map((col) =>
                    col.id !== columnId
                      ? col
                      : {
                          ...col,
                          tasks: col.tasks.map((task) =>
                            task.id !== cardId ? task : { ...task, title: title.trim() }
                          ),
                        }
                  ),
                }
          ),
        }));
        return true;
      },

      deleteCard: (boardId: string, columnId: string, cardId: string): void => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id !== boardId
              ? board
              : {
                  ...board,
                  columns: board.columns.map((col) =>
                    col.id !== columnId
                      ? col
                      : { ...col, tasks: col.tasks.filter((task) => task.id !== cardId) }
                  ),
                }
          ),
        }));
      },

      createColumn: (boardId: string, name: string): string | null => {
        const board = get().boards.find((b) => b.id === boardId);
        if (!board) return 'Board not found';
        const error = validateColumnName(name, board.columns.map((c) => c.name));
        if (error) return error;
        const newColumn: Column = { id: crypto.randomUUID(), name: name.trim(), tasks: [] };
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id !== boardId ? b : { ...b, columns: [...b.columns, newColumn] }
          ),
        }));
        return null;
      },

      renameColumn: (boardId: string, columnId: string, newName: string): string | null => {
        const board = get().boards.find((b) => b.id === boardId);
        if (!board) return 'Board not found';
        const column = board.columns.find((c) => c.id === columnId);
        if (!column) return 'Column not found';
        const error = validateColumnName(newName, board.columns.map((c) => c.name), column.name);
        if (error) return error;
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id !== boardId
              ? b
              : {
                  ...b,
                  columns: b.columns.map((c) =>
                    c.id !== columnId ? c : { ...c, name: newName.trim() }
                  ),
                }
          ),
        }));
        return null;
      },

      deleteColumn: (boardId: string, columnId: string): string | null => {
        const board = get().boards.find((b) => b.id === boardId);
        if (!board) return 'Board not found';
        const column = board.columns.find((c) => c.id === columnId);
        if (!column) return 'Column not found';
        if (PROTECTED_COLUMN_NAMES.some((p) => p.toLowerCase() === column.name.toLowerCase())) {
          return 'Cannot delete a default column';
        }
        if (column.tasks.length > 0) return 'Cannot delete a column with cards';
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id !== boardId ? b : { ...b, columns: b.columns.filter((c) => c.id !== columnId) }
          ),
        }));
        return null;
      },

      reorderColumn: (boardId: string, fromIndex: number, toIndex: number): string | null => {
        const board = get().boards.find((b) => b.id === boardId);
        if (!board) return 'Board not found';
        const display = normalizeColumns(board.columns);
        if (fromIndex < 0 || fromIndex >= display.length) return 'Invalid source index';
        if (toIndex < 0 || toIndex >= display.length) return 'Invalid target index';
        const sourceCol = display[fromIndex];
        if (PROTECTED_COLUMN_NAMES.some((p) => p.toLowerCase() === sourceCol.name.toLowerCase())) {
          return 'Cannot reorder a default column';
        }
        const newOrder = [...display];
        newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, sourceCol);
        const colMap = new Map(board.columns.map((c) => [c.id, c]));
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id !== boardId
              ? b
              : { ...b, columns: newOrder.map((c) => colMap.get(c.id) ?? c) }
          ),
        }));
        return null;
      },

      reorderTask: (boardId: string, columnId: string, sourceIndex: number, destinationIndex: number): string | null => {
        const board = get().boards.find((b) => b.id === boardId);
        if (!board) return 'Board not found';
        const column = board.columns.find((c) => c.id === columnId);
        if (!column) return 'Column not found';
        if (sourceIndex < 0 || sourceIndex >= column.tasks.length) return 'Invalid source index';
        if (destinationIndex < 0 || destinationIndex >= column.tasks.length) return 'Invalid destination index';
        if (sourceIndex === destinationIndex) return null;
        const newTasks = [...column.tasks];
        const [moved] = newTasks.splice(sourceIndex, 1);
        newTasks.splice(destinationIndex, 0, moved);
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id !== boardId
              ? b
              : {
                  ...b,
                  columns: b.columns.map((c) =>
                    c.id !== columnId ? c : { ...c, tasks: newTasks }
                  ),
                }
          ),
        }));
        return null;
      },

      moveCard: (boardId: string, fromColumnId: string, toColumnId: string, cardId: string): void => {
        if (fromColumnId === toColumnId) return;
        set((state) => {
          const board = state.boards.find((b) => b.id === boardId);
          if (!board) return state;
          const fromCol = board.columns.find((c) => c.id === fromColumnId);
          const card = fromCol?.tasks.find((t) => t.id === cardId);
          if (!card) return state;
          return {
            boards: state.boards.map((b) =>
              b.id !== boardId
                ? b
                : {
                    ...b,
                    columns: b.columns.map((col) => {
                      if (col.id === fromColumnId) {
                        return { ...col, tasks: col.tasks.filter((t) => t.id !== cardId) };
                      }
                      if (col.id === toColumnId) {
                        return { ...col, tasks: [...col.tasks, card] };
                      }
                      return col;
                    }),
                  }
            ),
          };
        });
      },
    }),
    {
      name: 'board-storage',
    }
  )
);
