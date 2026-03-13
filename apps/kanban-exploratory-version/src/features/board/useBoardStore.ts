import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { localStorageAdapter } from '@/features/persistence/localStorageAdapter';
import type { Board, Column, Task, Comment, Subtask } from '@/features/board/types';
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
  updateTask: (boardId: string, columnId: string, taskId: string, updates: Partial<Pick<Task, 'description' | 'labels' | 'dueDate' | 'priority' | 'title'>>) => boolean;
  addComment: (boardId: string, columnId: string, taskId: string, text: string) => Comment | null;
  deleteComment: (boardId: string, columnId: string, taskId: string, commentId: string) => void;
  addSubtask: (boardId: string, columnId: string, taskId: string, text: string) => Subtask | null;
  toggleSubtask: (boardId: string, columnId: string, taskId: string, subtaskId: string) => void;
  deleteSubtask: (boardId: string, columnId: string, taskId: string, subtaskId: string) => void;
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
        const newTask: Task = {
          id: crypto.randomUUID(),
          title: title.trim(),
          comments: [],
          subtasks: [],
          activityLog: [],
        };
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

      updateTask: (boardId, columnId, taskId, updates): boolean => {
        const board = get().boards.find((b) => b.id === boardId);
        if (!board) return false;
        const column = board.columns.find((c) => c.id === columnId);
        if (!column) return false;
        const task = column.tasks.find((t) => t.id === taskId);
        if (!task) return false;
        if (updates.title !== undefined && !updates.title.trim()) return false;
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id !== boardId
              ? b
              : {
                  ...b,
                  columns: b.columns.map((col) =>
                    col.id !== columnId
                      ? col
                      : {
                          ...col,
                          tasks: col.tasks.map((t) => {
                            if (t.id !== taskId) return t;
                            const priorityChanged = updates.priority !== undefined && updates.priority !== t.priority;
                            const newLog = priorityChanged
                              ? [
                                  ...(t.activityLog ?? []),
                                  {
                                    id: crypto.randomUUID(),
                                    action: 'priority' as const,
                                    details: `Changed priority to ${updates.priority}`,
                                    timestamp: new Date().toISOString(),
                                    author: 'System',
                                  },
                                ]
                              : (t.activityLog ?? []);
                            return { ...t, ...updates, activityLog: newLog };
                          }),
                        }
                  ),
                }
          ),
        }));
        return true;
      },

      moveCard: (boardId: string, fromColumnId: string, toColumnId: string, cardId: string): void => {
        if (fromColumnId === toColumnId) return;
        set((state) => {
          const board = state.boards.find((b) => b.id === boardId);
          if (!board) return state;
          const fromCol = board.columns.find((c) => c.id === fromColumnId);
          const card = fromCol?.tasks.find((t) => t.id === cardId);
          if (!card) return state;
          const toCol = board.columns.find((c) => c.id === toColumnId);
          const toColName = toCol?.name ?? toColumnId;
          const movedCard = {
            ...card,
            activityLog: [
              ...(card.activityLog ?? []),
              {
                id: crypto.randomUUID(),
                action: 'move' as const,
                details: `Moved to ${toColName}`,
                timestamp: new Date().toISOString(),
                author: 'System',
              },
            ],
          };
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
                        return { ...col, tasks: [...col.tasks, movedCard] };
                      }
                      return col;
                    }),
                  }
            ),
          };
        });
      },

      addComment: (boardId, columnId, taskId, text): Comment | null => {
        if (!text.trim()) return null;
        const board = get().boards.find((b) => b.id === boardId);
        const column = board?.columns.find((c) => c.id === columnId);
        const task = column?.tasks.find((t) => t.id === taskId);
        if (!task) return null;
        const comment: Comment = {
          id: crypto.randomUUID(),
          text: text.trim(),
          createdAt: new Date().toISOString(),
          author: 'You',
        };
        const logEntry = {
          id: crypto.randomUUID(),
          action: 'comment' as const,
          details: `Comment added: "${text.trim()}"`,
          timestamp: new Date().toISOString(),
          author: 'You',
        };
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id !== boardId
              ? b
              : {
                  ...b,
                  columns: b.columns.map((col) =>
                    col.id !== columnId
                      ? col
                      : {
                          ...col,
                          tasks: col.tasks.map((t) =>
                            t.id !== taskId
                              ? t
                              : {
                                  ...t,
                                  comments: [...(t.comments ?? []), comment],
                                  activityLog: [...(t.activityLog ?? []), logEntry],
                                }
                          ),
                        }
                  ),
                }
          ),
        }));
        return comment;
      },

      deleteComment: (boardId, columnId, taskId, commentId): void => {
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id !== boardId
              ? b
              : {
                  ...b,
                  columns: b.columns.map((col) =>
                    col.id !== columnId
                      ? col
                      : {
                          ...col,
                          tasks: col.tasks.map((t) =>
                            t.id !== taskId
                              ? t
                              : { ...t, comments: (t.comments ?? []).filter((c) => c.id !== commentId) }
                          ),
                        }
                  ),
                }
          ),
        }));
      },

      addSubtask: (boardId, columnId, taskId, text): Subtask | null => {
        if (!text.trim()) return null;
        const board = get().boards.find((b) => b.id === boardId);
        const column = board?.columns.find((c) => c.id === columnId);
        const task = column?.tasks.find((t) => t.id === taskId);
        if (!task) return null;
        const subtask: Subtask = {
          id: crypto.randomUUID(),
          text: text.trim(),
          isCompleted: false,
        };
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id !== boardId
              ? b
              : {
                  ...b,
                  columns: b.columns.map((col) =>
                    col.id !== columnId
                      ? col
                      : {
                          ...col,
                          tasks: col.tasks.map((t) =>
                            t.id !== taskId
                              ? t
                              : { ...t, subtasks: [...(t.subtasks ?? []), subtask] }
                          ),
                        }
                  ),
                }
          ),
        }));
        return subtask;
      },

      toggleSubtask: (boardId, columnId, taskId, subtaskId): void => {
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id !== boardId
              ? b
              : {
                  ...b,
                  columns: b.columns.map((col) =>
                    col.id !== columnId
                      ? col
                      : {
                          ...col,
                          tasks: col.tasks.map((t) =>
                            t.id !== taskId
                              ? t
                              : {
                                  ...t,
                                  subtasks: (t.subtasks ?? []).map((s) =>
                                    s.id !== subtaskId ? s : { ...s, isCompleted: !s.isCompleted }
                                  ),
                                }
                          ),
                        }
                  ),
                }
          ),
        }));
      },

      deleteSubtask: (boardId, columnId, taskId, subtaskId): void => {
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id !== boardId
              ? b
              : {
                  ...b,
                  columns: b.columns.map((col) =>
                    col.id !== columnId
                      ? col
                      : {
                          ...col,
                          tasks: col.tasks.map((t) =>
                            t.id !== taskId
                              ? t
                              : { ...t, subtasks: (t.subtasks ?? []).filter((s) => s.id !== subtaskId) }
                          ),
                        }
                  ),
                }
          ),
        }));
      },
    }),
    {
      name: 'flowboard-storage',
      storage: {
        getItem: (key: string) => localStorageAdapter.load<string>(key),
        setItem: (key: string, value: string) => localStorageAdapter.save(key, value),
        removeItem: (key: string) => localStorageAdapter.clear(key),
      },
      partialize: (state) => ({
        boards: state.boards,
        currentBoardId: state.currentBoardId,
      }),
    }
  )
);
