import { useState } from 'react';
import type { Task } from '@/features/board/types';
import { useBoardStore } from '@/features/board/useBoardStore';

const LABELS = ['bug', 'feature', 'urgent', 'enhancement'] as const;

interface CardDetailModalProps {
  boardId: string;
  columnId: string;
  task: Task;
  onClose: () => void;
  onDelete: () => void;
}

export function CardDetailModal({ boardId, columnId, task, onClose, onDelete }: CardDetailModalProps) {
  const updateTask = useBoardStore((s) => s.updateTask);
  const [titleValue, setTitleValue] = useState(task.title);

  const handleTitleBlur = () => {
    updateTask(boardId, columnId, task.id, { title: titleValue });
  };

  const handleDescriptionBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    updateTask(boardId, columnId, task.id, { description: e.target.value });
  };

  const handleLabelToggle = (label: string) => {
    const current = task.labels ?? [];
    const next = current.includes(label)
      ? current.filter((l) => l !== label)
      : [...current, label];
    updateTask(boardId, columnId, task.id, { labels: next });
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTask(boardId, columnId, task.id, { dueDate: e.target.value });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as Task['priority'] | '';
    updateTask(boardId, columnId, task.id, { priority: val || undefined });
  };

  return (
    <div data-testid="card-detail-modal">
      <input
        data-testid="card-detail-title"
        value={titleValue}
        onChange={(e) => setTitleValue(e.target.value)}
        onBlur={handleTitleBlur}
      />
      <textarea
        data-testid="card-detail-description"
        defaultValue={task.description ?? ''}
        onBlur={handleDescriptionBlur}
      />
      {LABELS.map((label) => (
        <button
          key={label}
          data-testid={`card-label-${label}`}
          onClick={() => handleLabelToggle(label)}
          aria-pressed={(task.labels ?? []).includes(label)}
        >
          {label}
        </button>
      ))}
      <input
        data-testid="card-detail-due-date"
        type="date"
        defaultValue={task.dueDate ?? ''}
        onChange={handleDueDateChange}
      />
      <select
        data-testid="card-detail-priority"
        defaultValue={task.priority ?? ''}
        onChange={handlePriorityChange}
      >
        <option value="">none</option>
        <option value="low">low</option>
        <option value="medium">medium</option>
        <option value="high">high</option>
      </select>
      <button data-testid="card-detail-close" onClick={onClose}>
        Close
      </button>
      <button data-testid="card-detail-delete" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}
