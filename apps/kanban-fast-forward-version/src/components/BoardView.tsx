import { useState } from 'react';
import { useBoardStore } from '../domain/boardStore';
import { normalizePositions } from '../domain/position';
import { TaskCard } from './TaskCard';

export function BoardView() {
  const selectedBoardId = useBoardStore((s) => s.selectedBoardId);
  const boards = useBoardStore((s) => s.boards);
  const addTask = useBoardStore((s) => s.addTask);

  const [addInputs, setAddInputs] = useState<Record<string, string>>({});
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});

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

  function handleAddTask(columnId: string) {
    const title = addInputs[columnId] ?? '';
    if (!title.trim()) {
      setAddErrors((prev) => ({ ...prev, [columnId]: 'Task title is required' }));
      return;
    }
    addTask(columnId, title.trim());
    setAddInputs((prev) => ({ ...prev, [columnId]: '' }));
    setAddErrors((prev) => ({ ...prev, [columnId]: '' }));
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
    </div>
  );
}
