import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Board } from '@/features/board/types';

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
    }),
    {
      name: 'board-storage',
    }
  )
);
