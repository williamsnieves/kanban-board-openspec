import { useState } from 'react';
import { useBoardStore } from '../domain/boardStore';
import { normalizePositions } from '../domain/position';
import { TaskCard } from './TaskCard';
import type { Priority } from '../domain/types';

const VALID_PRIORITIES = ['low', 'medium', 'high'] as const;

function isValidDate(d: string): boolean {
  if (!d) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
  const date = new Date(d + 'T00:00:00');
  return !isNaN(date.getTime());
}

export function BoardView() {
  const selectedBoardId = useBoardStore((s) => s.selectedBoardId);
  const boards = useBoardStore((s) => s.boards);
  const addTask = useBoardStore((s) => s.addTask);

  const [addInputs, setAddInputs] = useState<Record<string, string>>({});
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});
  const [addPriorities, setAddPriorities] = useState<Record<string, string>>({});
  const [addDueDates, setAddDueDates] = useState<Record<string, string>>({});
  const [addPriorityErrors, setAddPriorityErrors] = useState<Record<string, string>>({});
  const [addDueDateErrors, setAddDueDateErrors] = useState<Record<string, string>>({});

  if (!selectedBoardId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select or create a board to get started.
      </div>
    );
  }

  const board = boards.find((b) => b.id === selectedBoardId);
  if (!board) return null;

  const sortedColumns = normalizePositions(board.columns);
  const totalTasks = board.columns.reduce((sum, col) => sum + col.tasks.length, 0);

  function handleAddTask(columnId: string) {
    const title = addInputs[columnId] ?? '';
    if (!title.trim()) {
      setAddErrors((prev) => ({ ...prev, [columnId]: 'Task title is required' }));
      return;
    }
    const priority = (addPriorities[columnId] ?? 'medium') as Priority;
    const dueDateVal = addDueDates[columnId] ?? '';
    let valid = true;
    if (!VALID_PRIORITIES.includes(priority)) {
      setAddPriorityErrors(p => ({ ...p, [columnId]: 'Priority must be one of: low, medium, high.' }));
      valid = false;
    } else {
      setAddPriorityErrors(p => ({ ...p, [columnId]: '' }));
    }
    if (dueDateVal && !isValidDate(dueDateVal)) {
      setAddDueDateErrors(p => ({ ...p, [columnId]: 'Due date must be a valid date (YYYY-MM-DD).' }));
      valid = false;
    } else {
      setAddDueDateErrors(p => ({ ...p, [columnId]: '' }));
    }
    if (!valid) return;
    addTask(columnId, title.trim(), priority, dueDateVal || undefined);
    setAddInputs((prev) => ({ ...prev, [columnId]: '' }));
    setAddErrors((prev) => ({ ...prev, [columnId]: '' }));
    setAddPriorities(p => ({ ...p, [columnId]: 'medium' }));
    setAddDueDates(p => ({ ...p, [columnId]: '' }));
  }

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-xl font-bold px-4 py-3 border-b">{board.name}</h1>
      <div className="flex gap-4 p-4 overflow-x-auto flex-1">
        {sortedColumns.map((col) => {
          const colTasks = normalizePositions(col.tasks);
          return (
            <div
              key={col.id}
              data-testid={`column-${col.name}`}
              className="flex flex-col gap-2 bg-gray-50 rounded p-3 min-w-[220px] flex-shrink-0"
            >
              <h2 className="font-semibold text-sm">{col.name}</h2>
              {colTasks.map((task, idx) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  columns={sortedColumns}
                  isFirst={idx === 0}
                  isLast={idx === colTasks.length - 1}
                />
              ))}
              <div className="flex flex-col gap-1 mt-1">
                <input
                  data-testid="add-task-input"
                  type="text"
                  value={addInputs[col.id] ?? ''}
                  onChange={(e) =>
                    setAddInputs((prev) => ({ ...prev, [col.id]: e.target.value }))
                  }
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(col.id); }}
                  placeholder="New task title"
                  className="border rounded px-2 py-1 text-xs"
                />
                {addErrors[col.id] && (
                  <span data-testid="task-title-error" className="text-red-500 text-xs">
                    {addErrors[col.id]}
                  </span>
                )}
                <select
                  data-testid="task-priority-select"
                  value={addPriorities[col.id] ?? 'medium'}
                  onChange={(e) => setAddPriorities(p => ({ ...p, [col.id]: e.target.value }))}
                  className="border rounded px-1 py-0.5 text-xs"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                {addPriorityErrors[col.id] && <span data-testid="task-priority-error" className="text-red-500 text-xs">{addPriorityErrors[col.id]}</span>}
                <input
                  data-testid="task-due-date-input"
                  type="text"
                  placeholder="YYYY-MM-DD"
                  value={addDueDates[col.id] ?? ''}
                  onChange={(e) => setAddDueDates(p => ({ ...p, [col.id]: e.target.value }))}
                  className="border rounded px-1 py-0.5 text-xs"
                />
                {addDueDateErrors[col.id] && <span data-testid="task-due-date-error" className="text-red-500 text-xs">{addDueDateErrors[col.id]}</span>}
                <button
                  data-testid="add-task-btn"
                  onClick={() => handleAddTask(col.id)}
                  className="text-xs text-gray-500 hover:text-gray-800 border border-dashed rounded py-1"
                >
                  + Add task
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {totalTasks === 0 && (
        <div data-testid="empty-state-no-tasks" className="flex flex-col items-center justify-center flex-1 gap-3 text-gray-500 mt-8 pb-8">
          <p className="text-base">No tasks yet</p>
          <button
            data-testid="empty-state-create-task-cta"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Add your first task
          </button>
        </div>
      )}
    </div>
  );
}
