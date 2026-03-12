import { useState } from 'react';
import type { Task, Column, Priority } from '../domain/types';
import { useBoardStore } from '../domain/boardStore';

const VALID_PRIORITIES = ['low', 'medium', 'high'] as const;

function isValidDate(d: string): boolean {
  if (!d) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
  const date = new Date(d + 'T00:00:00');
  return !isNaN(date.getTime());
}

interface Props {
  task: Task;
  columns: Column[];
  isFirst: boolean;
  isLast: boolean;
}

export function TaskCard({ task, columns, isFirst, isLast }: Props) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description ?? '');
  const [editError, setEditError] = useState('');
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.dueDate ?? '');
  const [editPriorityError, setEditPriorityError] = useState('');
  const [editDueDateError, setEditDueDateError] = useState('');
  const [showMove, setShowMove] = useState(false);

  const updateTask = useBoardStore((s) => s.updateTask);
  const deleteTask = useBoardStore((s) => s.deleteTask);
  const reorderTask = useBoardStore((s) => s.reorderTask);
  const moveTask = useBoardStore((s) => s.moveTask);

  const otherColumns = columns.filter((c) => c.id !== task.columnId);

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editTitle.trim()) {
      setEditError('Task title is required');
      return;
    }
    let valid = true;
    if (!VALID_PRIORITIES.includes(editPriority)) {
      setEditPriorityError('Priority must be one of: low, medium, high.');
      valid = false;
    } else {
      setEditPriorityError('');
    }
    if (editDueDate && !isValidDate(editDueDate)) {
      setEditDueDateError('Due date must be a valid date (YYYY-MM-DD).');
      valid = false;
    } else {
      setEditDueDateError('');
    }
    if (!valid) return;
    updateTask(task.id, editTitle.trim(), editPriority, editDueDate || undefined, editDesc.trim());
    setEditing(false);
    setEditError('');
  }

  if (editing) {
    return (
      <div data-testid="task-item" className="bg-white border rounded p-2 flex flex-col gap-1 shadow-sm">
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-1">
          <input
            data-testid="task-title-input"
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
          {editError && (
            <span data-testid="task-title-error" className="text-red-500 text-xs">
              {editError}
            </span>
          )}
          <textarea
            data-testid="task-description-input"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            className="border rounded px-2 py-1 text-sm resize-none"
            rows={2}
          />
          <select data-testid="task-priority-select" value={editPriority} onChange={(e) => setEditPriority(e.target.value as Priority)} className="border rounded px-1 py-0.5 text-xs">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {editPriorityError && <span data-testid="task-priority-error" className="text-red-500 text-xs">{editPriorityError}</span>}
          <input data-testid="task-due-date-input" type="text" placeholder="YYYY-MM-DD" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} className="border rounded px-1 py-0.5 text-xs" />
          {editDueDateError && <span data-testid="task-due-date-error" className="text-red-500 text-xs">{editDueDateError}</span>}
          <div className="flex gap-1">
            <button
              data-testid="task-submit-btn"
              type="submit"
              className="text-xs bg-green-600 text-white px-2 py-0.5 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => { setEditing(false); setEditError(''); }}
              className="text-xs border px-2 py-0.5 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div data-testid="task-item" className="bg-white border rounded p-2 flex flex-col gap-1 shadow-sm">
      <div className="font-medium text-sm">{task.title}</div>
      {task.description && (
        <div className="text-xs text-gray-500">{task.description}</div>
      )}
      <div className="flex flex-wrap items-center gap-1 mt-1">
        <span
          data-testid="task-priority-badge"
          className={`text-xs px-1.5 py-0.5 rounded font-medium ${
            task.priority === 'high' ? 'bg-red-100 text-red-700' :
            task.priority === 'low' ? 'bg-green-100 text-green-700' :
            'bg-yellow-100 text-yellow-700'
          }`}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
        {task.dueDate && (
          <span data-testid="task-due-date-display" className="text-xs text-gray-500">
            {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            })}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1 mt-1">
        <button
          data-testid="task-edit-btn"
          onClick={() => setEditing(true)}
          className="text-xs px-2 py-0.5 border rounded"
        >
          Edit
        </button>
        <button
          data-testid="task-delete-btn"
          onClick={() => deleteTask(task.id)}
          className="text-xs px-2 py-0.5 border rounded text-red-600"
        >
          Delete
        </button>
        <button
          data-testid="task-move-up"
          onClick={() => reorderTask(task.columnId, task.id, task.position - 1)}
          disabled={isFirst}
          className="text-xs px-2 py-0.5 border rounded disabled:opacity-30"
        >
          ↑
        </button>
        <button
          data-testid="task-move-down"
          onClick={() => reorderTask(task.columnId, task.id, task.position + 1)}
          disabled={isLast}
          className="text-xs px-2 py-0.5 border rounded disabled:opacity-30"
        >
          ↓
        </button>
        {otherColumns.length > 0 && (
          <button
            data-testid="move-task-btn"
            onClick={() => setShowMove((v) => !v)}
            className="text-xs px-2 py-0.5 border rounded text-blue-600"
          >
            Move
          </button>
        )}
      </div>
      {showMove && (
        <div className="flex flex-wrap gap-1 mt-1">
          {otherColumns.map((col) => (
            <button
              key={col.id}
              data-testid={`move-to-${col.name}`}
              onClick={() => { moveTask(task.id, col.id); setShowMove(false); }}
              className="text-xs px-2 py-0.5 bg-blue-50 border border-blue-300 rounded"
            >
              → {col.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
