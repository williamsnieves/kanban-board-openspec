import { useState, useRef } from 'react';
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
  const addComment = useBoardStore((s) => s.addComment);
  const deleteComment = useBoardStore((s) => s.deleteComment);
  const addSubtask = useBoardStore((s) => s.addSubtask);
  const toggleSubtask = useBoardStore((s) => s.toggleSubtask);
  const deleteSubtask = useBoardStore((s) => s.deleteSubtask);
  const boards = useBoardStore((s) => s.boards);

  const [titleValue, setTitleValue] = useState(task.title);
  const [activeTab, setActiveTab] = useState<'details' | 'checklist' | 'activity'>('details');
  const [subtaskInput, setSubtaskInput] = useState('');
  const [commentInput, setCommentInput] = useState('');

  const subtaskInputRef = useRef<HTMLInputElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // Read live task from store for subtasks/comments/activityLog
  const board = boards.find((b) => b.id === boardId);
  const column = board?.columns.find((c) => c.id === columnId);
  const liveTask = column?.tasks.find((t) => t.id === task.id) ?? task;

  const completedCount = (liveTask.subtasks ?? []).filter((s) => s.isCompleted).length;
  const totalCount = (liveTask.subtasks ?? []).length;

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

  const handleAddSubtask = () => {
    addSubtask(boardId, columnId, task.id, subtaskInput);
    setSubtaskInput('');
  };

  const handleSubmitComment = () => {
    addComment(boardId, columnId, task.id, commentInput);
    setCommentInput('');
  };

  return (
    <div data-testid="card-detail-modal">
      <input
        data-testid="card-detail-title"
        value={titleValue}
        onChange={(e) => setTitleValue(e.target.value)}
        onBlur={handleTitleBlur}
      />
      <button data-testid="tab-details" onClick={() => setActiveTab('details')}>Details</button>
      <button data-testid="tab-checklist" onClick={() => setActiveTab('checklist')}>Checklist</button>
      <button data-testid="tab-activity" onClick={() => setActiveTab('activity')}>Activity</button>

      {activeTab === 'details' && (
        <div>
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
        </div>
      )}

      {activeTab === 'checklist' && (
        <div data-testid="tab-panel-checklist">
          <span data-testid="subtask-progress">{completedCount}/{totalCount} completed</span>
          {(liveTask.subtasks ?? []).map((subtask) => (
            <div key={subtask.id} data-testid={`subtask-item-${subtask.id}`}>
              <input
                type="checkbox"
                data-testid={`subtask-toggle-${subtask.id}`}
                checked={subtask.isCompleted}
                onChange={() => toggleSubtask(boardId, columnId, task.id, subtask.id)}
              />
              <span style={{ textDecoration: subtask.isCompleted ? 'line-through' : 'none' }}>{subtask.text}</span>
              <button
                data-testid={`subtask-delete-${subtask.id}`}
                onClick={() => deleteSubtask(boardId, columnId, task.id, subtask.id)}
              >
                Delete
              </button>
            </div>
          ))}
          <input
            ref={subtaskInputRef}
            data-testid="subtask-input"
            value={subtaskInput}
            onChange={(e) => setSubtaskInput(e.target.value)}
          />
          <button data-testid="subtask-add-btn" onClick={handleAddSubtask}>Add</button>
        </div>
      )}

      {activeTab === 'activity' && (
        <div data-testid="tab-panel-activity">
          {(liveTask.activityLog ?? []).map((log) => (
            <div key={log.id} data-testid={`activity-item-${log.id}`}>
              {log.details} — {log.timestamp}
            </div>
          ))}
          {(liveTask.comments ?? []).map((comment) => (
            <div key={comment.id} data-testid={`comment-item-${comment.id}`}>
              {comment.text}{' '}
              <button
                data-testid={`comment-delete-${comment.id}`}
                onClick={() => deleteComment(boardId, columnId, task.id, comment.id)}
              >
                Delete
              </button>
            </div>
          ))}
          <textarea
            ref={commentInputRef}
            data-testid="comment-input"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <button data-testid="comment-submit-btn" onClick={handleSubmitComment}>Submit</button>
        </div>
      )}

      <button data-testid="card-detail-close" onClick={onClose}>
        Close
      </button>
      <button data-testid="card-detail-delete" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}
