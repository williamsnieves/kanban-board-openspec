import { create } from 'zustand';
import type { Board, Task } from './types';
import { createBoard as buildBoard } from './board';
import { normalizePositions, insertAtPosition } from './position';
import { saveState, loadState } from './storage';

interface BoardStore {
  boards: Board[];
  selectedBoardId: string | null;

  createBoard: (name: string) => void;
  selectBoard: (id: string) => void;
  renameBoard: (boardId: string, name: string) => void;
  deleteBoard: (boardId: string) => void;

  addTask: (columnId: string, title: string, description?: string) => void;
  updateTask: (taskId: string, title: string, description?: string) => void;
  deleteTask: (taskId: string) => void;

  reorderTask: (columnId: string, taskId: string, newPosition: number) => void;
  moveTask: (taskId: string, targetColumnId: string) => void;
}

function persist(boards: Board[]): void {
  saveState(boards);
}

const initial = loadState();

export const useBoardStore = create<BoardStore>((set) => ({
  boards: initial ?? [],
  selectedBoardId: null,

  createBoard: (name) => {
    if (!name.trim()) return;
    const board = buildBoard(name.trim());
    set((state) => {
      const next = [...state.boards, board];
      persist(next);
      return { boards: next };
    });
  },

  selectBoard: (id) => {
    set({ selectedBoardId: id });
  },

  renameBoard: (boardId, name) => {
    if (!name.trim()) return;
    set((state) => {
      const next = state.boards.map((b) =>
        b.id === boardId ? { ...b, name: name.trim() } : b
      );
      persist(next);
      return { boards: next };
    });
  },

  deleteBoard: (boardId) => {
    set((state) => {
      const next = state.boards.filter((b) => b.id !== boardId);
      persist(next);
      return {
        boards: next,
        selectedBoardId: state.selectedBoardId === boardId ? null : state.selectedBoardId,
      };
    });
  },

  addTask: (columnId, title, description) => {
    if (!title.trim()) return;
    const task: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description?.trim(),
      columnId,
      position: 0,
    };
    set((state) => {
      const next = state.boards.map((board) => ({
        ...board,
        columns: board.columns.map((col) => {
          if (col.id !== columnId) return col;
          const normalized = normalizePositions([...col.tasks, { ...task, position: col.tasks.length }]);
          return { ...col, tasks: normalized };
        }),
      }));
      persist(next);
      return { boards: next };
    });
  },

  updateTask: (taskId, title, description) => {
    if (!title.trim()) return;
    set((state) => {
      const next = state.boards.map((board) => ({
        ...board,
        columns: board.columns.map((col) => ({
          ...col,
          tasks: col.tasks.map((t) =>
            t.id === taskId
              ? { ...t, title: title.trim(), description: description?.trim() }
              : t,
          ),
        })),
      }));
      persist(next);
      return { boards: next };
    });
  },

  deleteTask: (taskId) => {
    set((state) => {
      const next = state.boards.map((board) => ({
        ...board,
        columns: board.columns.map((col) => {
          const filtered = col.tasks.filter((t) => t.id !== taskId);
          if (filtered.length === col.tasks.length) return col;
          return { ...col, tasks: normalizePositions(filtered) };
        }),
      }));
      persist(next);
      return { boards: next };
    });
  },

  reorderTask: (columnId, taskId, newPosition) => {
    set((state) => {
      const next = state.boards.map((board) => ({
        ...board,
        columns: board.columns.map((col) => {
          if (col.id !== columnId) return col;
          const sorted = normalizePositions(col.tasks);
          const idx = sorted.findIndex((t) => t.id === taskId);
          if (idx === -1) return col;
          const clamped = Math.max(0, Math.min(newPosition, sorted.length - 1));
          const updated = sorted.map((t) => {
            if (t.id === taskId) return { ...t, position: clamped };
            if (t.position === clamped) return { ...t, position: idx };
            return t;
          });
          return { ...col, tasks: normalizePositions(updated) };
        }),
      }));
      persist(next);
      return { boards: next };
    });
  },

  moveTask: (taskId, targetColumnId) => {
    set((state) => {
      let taskToMove: Task | null = null;
      let sourceColumnId: string | null = null;

      for (const board of state.boards) {
        for (const col of board.columns) {
          const found = col.tasks.find((t) => t.id === taskId);
          if (found) {
            taskToMove = found;
            sourceColumnId = col.id;
            break;
          }
        }
        if (taskToMove) break;
      }

      if (!taskToMove || !sourceColumnId || sourceColumnId === targetColumnId) {
        return state;
      }

      const movedTask = taskToMove;
      const srcId = sourceColumnId;

      const next = state.boards.map((board) => ({
        ...board,
        columns: board.columns.map((col) => {
          if (col.id === srcId) {
            return {
              ...col,
              tasks: normalizePositions(col.tasks.filter((t) => t.id !== taskId)),
            };
          }
          if (col.id === targetColumnId) {
            const updated: Task = { ...movedTask, columnId: targetColumnId, position: col.tasks.length };
            return {
              ...col,
              tasks: insertAtPosition(col.tasks, updated, col.tasks.length),
            };
          }
          return col;
        }),
      }));
      persist(next);
      return { boards: next };
    });
  },
}));
