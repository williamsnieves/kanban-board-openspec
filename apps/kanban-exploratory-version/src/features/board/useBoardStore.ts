import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Board, Task } from '@/features/board/types';

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
