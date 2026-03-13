import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBoardStore } from '@/features/board/useBoardStore';
import { useThemeStore } from '@/features/theme/useThemeStore';
import { normalizeColumns } from '@/features/board/normalizeColumns';
import { PROTECTED_COLUMN_NAMES } from '@/features/board/columnValidation';
import { CardDetailModal } from '@/features/boardView/CardDetailModal';

export function BoardView() {
  const { id } = useParams<{ id: string }>();
  const setCurrentBoard = useBoardStore((s) => s.setCurrentBoard);
  const getCurrentBoard = useBoardStore((s) => s.getCurrentBoard);
  const createCard = useBoardStore((s) => s.createCard);
  const editCard = useBoardStore((s) => s.editCard);
  const deleteCard = useBoardStore((s) => s.deleteCard);
  const moveCard = useBoardStore((s) => s.moveCard);
  const createColumn = useBoardStore((s) => s.createColumn);
  const renameColumn = useBoardStore((s) => s.renameColumn);
  const deleteColumn = useBoardStore((s) => s.deleteColumn);
  const reorderColumn = useBoardStore((s) => s.reorderColumn);
  const { theme, toggleTheme } = useThemeStore();

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedCardColumnId, setSelectedCardColumnId] = useState<string | null>(null);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
  const [addTitle, setAddTitle] = useState<Record<string, string>>({});
  const [editTitle, setEditTitle] = useState('');
  const [addError, setAddError] = useState<Record<string, string>>({});
  const [editError, setEditError] = useState('');

  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnError, setNewColumnError] = useState('');

  const [renamingColumnId, setRenamingColumnId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameError, setRenameError] = useState('');

  const [deletingColumnId, setDeletingColumnId] = useState<string | null>(null);
  const [deleteColumnError, setDeleteColumnError] = useState<Record<string, string>>({});

  const [dragSourceIndex, setDragSourceIndex] = useState<number | null>(null);
  const [reorderError, setReorderError] = useState('');

  useEffect(() => {
    if (id) {
      setCurrentBoard(id);
    }
  }, [id, setCurrentBoard]);

  const board = getCurrentBoard();

  if (!board) {
    return (
      <div>
        <p>Board not found.</p>
        <Link to="/">Back to Dashboard</Link>
      </div>
    );
  }

  const displayColumns = normalizeColumns(board.columns);

  const handleAddCard = (columnId: string) => {
    const title = addTitle[columnId] ?? '';
    const result = createCard(board.id, columnId, title);
    if (result === null) {
      setAddError((prev) => ({ ...prev, [columnId]: 'Card title is required' }));
      return;
    }
    setAddTitle((prev) => ({ ...prev, [columnId]: '' }));
    setAddError((prev) => ({ ...prev, [columnId]: '' }));
  };

  const handleEditStart = (cardId: string, currentTitle: string) => {
    setEditingCardId(cardId);
    setEditTitle(currentTitle);
    setEditError('');
    setDeletingCardId(null);
  };

  const handleEditSave = (columnId: string, cardId: string) => {
    const result = editCard(board.id, columnId, cardId, editTitle);
    if (!result) {
      setEditError('Card title is required');
      return;
    }
    setEditingCardId(null);
    setEditTitle('');
    setEditError('');
  };

  const handleEditCancel = () => {
    setEditingCardId(null);
    setEditTitle('');
    setEditError('');
  };

  const handleDeleteStart = (cardId: string) => {
    setDeletingCardId(cardId);
    setEditingCardId(null);
  };

  const handleDeleteConfirm = (columnId: string, cardId: string) => {
    deleteCard(board.id, columnId, cardId);
    setDeletingCardId(null);
  };

  const handleDeleteCancel = () => {
    setDeletingCardId(null);
  };

  const handleMoveCard = (fromColumnId: string, toColumnId: string, cardId: string) => {
    moveCard(board.id, fromColumnId, toColumnId, cardId);
  };

  const handleCreateColumn = () => {
    if (!newColumnName.trim()) {
      setNewColumnError('Column name is required');
      return;
    }
    const error = createColumn(board.id, newColumnName);
    if (error) {
      setNewColumnError(error);
      return;
    }
    setNewColumnName('');
    setNewColumnError('');
  };

  const handleRenameStart = (columnId: string, currentName: string) => {
    setRenamingColumnId(columnId);
    setRenameValue(currentName);
    setRenameError('');
    setDeletingColumnId(null);
  };

  const handleRenameSave = (columnId: string) => {
    if (!renameValue.trim()) {
      setRenameError('Column name is required');
      return;
    }
    const error = renameColumn(board.id, columnId, renameValue);
    if (error) {
      setRenameError(error);
      return;
    }
    setRenamingColumnId(null);
    setRenameValue('');
    setRenameError('');
  };

  const handleRenameCancel = () => {
    setRenamingColumnId(null);
    setRenameValue('');
    setRenameError('');
  };

  const handleDeleteColumnStart = (columnId: string) => {
    setDeletingColumnId(columnId);
    setRenamingColumnId(null);
    setDeleteColumnError((prev) => ({ ...prev, [columnId]: '' }));
  };

  const handleDeleteColumnConfirm = (columnId: string) => {
    const error = deleteColumn(board.id, columnId);
    if (error) {
      setDeleteColumnError((prev) => ({ ...prev, [columnId]: error }));
      setDeletingColumnId(null);
      return;
    }
    setDeleteColumnError((prev) => {
      const next = { ...prev };
      delete next[columnId];
      return next;
    });
    setDeletingColumnId(null);
  };

  const handleDeleteColumnCancel = () => {
    setDeletingColumnId(null);
  };

  const isProtectedColumn = (name: string) =>
    PROTECTED_COLUMN_NAMES.some((p) => p.toLowerCase() === name.toLowerCase());

  const handleDragStart = (e: React.DragEvent, index: number, columnName: string) => {
    if (isProtectedColumn(columnName)) {
      e.preventDefault();
      return;
    }
    setDragSourceIndex(index);
    setReorderError('');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (dragSourceIndex === null || dragSourceIndex === targetIndex) {
      setDragSourceIndex(null);
      return;
    }
    const error = reorderColumn(board.id, dragSourceIndex, targetIndex);
    if (error) {
      setReorderError(error);
    }
    setDragSourceIndex(null);
  };

  const handleMoveLeft = (columnIndex: number, columnName: string) => {
    if (isProtectedColumn(columnName)) {
      setReorderError('Cannot reorder a default column');
      return;
    }
    const targetIndex = columnIndex - 1;
    if (targetIndex < 0 || isProtectedColumn(displayColumns[targetIndex].name)) {
      return;
    }
    const error = reorderColumn(board.id, columnIndex, targetIndex);
    if (error) setReorderError(error);
  };

  const handleMoveRight = (columnIndex: number, columnName: string) => {
    if (isProtectedColumn(columnName)) {
      setReorderError('Cannot reorder a default column');
      return;
    }
    const targetIndex = columnIndex + 1;
    if (targetIndex >= displayColumns.length) {
      return;
    }
    const error = reorderColumn(board.id, columnIndex, targetIndex);
    if (error) setReorderError(error);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold text-center py-4">{board.name}</h1>
      <button onClick={toggleTheme}>{theme === 'light' ? 'Dark mode' : 'Light mode'}</button>
      <div>
        {reorderError && (
          <span data-testid="column-reorder-error">{reorderError}</span>
        )}
        <div className="flex flex-row gap-4 overflow-x-auto px-4 pb-6 items-start">
          {displayColumns.map((column, index) => (
            <div
              key={column.id}
              className="w-72 flex-shrink-0 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700"
              draggable={!isProtectedColumn(column.name)}
              onDragStart={(e) => handleDragStart(e, index, column.name)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              {renamingColumnId === column.id ? (
                <div>
                  <input
                    data-testid={`column-rename-input-${column.id}`}
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                  />
                  {renameError && (
                    <span data-testid={`column-rename-error-${column.id}`}>{renameError}</span>
                  )}
                  <button
                    data-testid={`column-rename-save-${column.id}`}
                    onClick={() => handleRenameSave(column.id)}
                  >
                    Save
                  </button>
                  <button
                    data-testid={`column-rename-cancel-${column.id}`}
                    onClick={handleRenameCancel}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-sm font-semibold px-3 pt-3 pb-1 text-gray-700 dark:text-gray-200">{column.name}</h2>
                  <div className="flex items-center gap-1 px-2 pb-2 flex-wrap">
                    <button
                      className="text-xs px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                      data-testid={`column-move-left-${column.id}`}
                      onClick={() => handleMoveLeft(index, column.name)}
                    >
                      ←
                    </button>
                    <button
                      className="text-xs px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                      data-testid={`column-move-right-${column.id}`}
                      onClick={() => handleMoveRight(index, column.name)}
                    >
                      →
                    </button>
                    <button
                      className="text-xs px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                      data-testid={`column-rename-trigger-${column.id}`}
                      onClick={() => handleRenameStart(column.id, column.name)}
                    >
                      Rename
                    </button>
                    {deletingColumnId === column.id ? (
                      <>
                        <span>Delete column?</span>
                        <button
                          className="text-xs px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                          data-testid={`column-delete-confirm-${column.id}`}
                          onClick={() => handleDeleteColumnConfirm(column.id)}
                        >
                          Yes
                        </button>
                        <button
                          className="text-xs px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                          data-testid={`column-delete-cancel-${column.id}`}
                          onClick={handleDeleteColumnCancel}
                        >
                          No
                        </button>
                      </>
                    ) : (
                      <button
                        className="text-xs px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                        data-testid={`column-delete-trigger-${column.id}`}
                        onClick={() => handleDeleteColumnStart(column.id)}
                      >
                        Delete column
                      </button>
                    )}
                    {deleteColumnError[column.id] && (
                      <span data-testid={`column-delete-error-${column.id}`}>
                        {deleteColumnError[column.id]}
                      </span>
                    )}
                  </div>
                </>
              )}
              {column.tasks.length === 0 ? (
                <p className="text-xs text-gray-400 px-3 py-4 text-center">No tasks</p>
              ) : (
                <ul className="flex flex-col gap-2 px-2 pb-2 flex-1">
                  {column.tasks.map((task) => (
                    <li
                      key={task.id}
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-2.5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {editingCardId === task.id ? (
                        <div>
                          <input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                          {editError && <span>{editError}</span>}
                          <button onClick={() => handleEditSave(column.id, task.id)}>Save</button>
                          <button onClick={handleEditCancel}>Cancel</button>
                        </div>
                      ) : deletingCardId === task.id ? (
                        <div>
                          <span>{task.title}</span>
                          <span>Delete this card?</span>
                          <button onClick={() => handleDeleteConfirm(column.id, task.id)}>Yes</button>
                          <button onClick={handleDeleteCancel}>No</button>
                        </div>
                      ) : (
                        <div>
                          <div
                            data-testid={`card-open-detail-${task.id}`}
                            onClick={() => { setSelectedCardId(task.id); setSelectedCardColumnId(column.id); }}
                            style={{ cursor: 'pointer' }}
                          >
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-100 block">{task.title}</span>
                            <span data-testid={`card-description-indicator-${task.id}`} style={{ display: task.description ? 'inline' : 'none' }}>📝</span>
                            <div className="flex flex-wrap items-center gap-1 mt-1.5">
                              {task.labels && task.labels.length > 0 && (
                                <div data-testid={`card-labels-${task.id}`} className="flex flex-wrap gap-1">
                                  {task.labels.map(label => (
                                    <span key={label} className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                                      label === 'bug' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                      label === 'feature' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                      label === 'urgent' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    }`}>{label}</span>
                                  ))}
                                </div>
                              )}
                              {task.dueDate && (
                                <span data-testid={`card-due-date-${task.id}`} className="text-xs text-gray-500 dark:text-gray-400">
                                  📅 {task.dueDate}
                                </span>
                              )}
                              {task.priority && (
                                <span data-testid={`card-priority-${task.id}`} className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                  task.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                  'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                }`}>{task.priority}</span>
                              )}
                              {task.comments?.length > 0 && <span data-testid={`card-comment-count-${task.id}`}>{task.comments.length} comment{task.comments.length !== 1 ? 's' : ''}</span>}
                              {task.subtasks?.length > 0 && <span data-testid={`card-subtask-progress-${task.id}`}>{task.subtasks.filter(s => s.isCompleted).length}/{task.subtasks.length}</span>}
                            </div>
                          </div>
                          <button
                            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-600 rounded px-1.5 py-0.5"
                            onClick={() => handleEditStart(task.id, task.title)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-600 rounded px-1.5 py-0.5"
                            onClick={() => handleDeleteStart(task.id)}
                          >
                            Delete
                          </button>
                          <select
                            value={column.id}
                            onChange={(e) => handleMoveCard(column.id, e.target.value, task.id)}
                          >
                            {displayColumns.map((col) => (
                              <option key={col.id} value={col.id}>
                                {col.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex items-center gap-1 px-2 pb-2">
                <input
                  className="flex-1 text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  value={addTitle[column.id] ?? ''}
                  onChange={(e) =>
                    setAddTitle((prev) => ({ ...prev, [column.id]: e.target.value }))
                  }
                />
                {addError[column.id] && <span>{addError[column.id]}</span>}
                <button
                  className="text-sm px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => handleAddCard(column.id)}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <input
          data-testid="add-column-input"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
        />
        {newColumnError && <span data-testid="add-column-error">{newColumnError}</span>}
        <button data-testid="add-column-submit" onClick={handleCreateColumn}>
          Add column
        </button>
      </div>
      {selectedCardId && (() => {
        const selCol = displayColumns.find(c => c.id === selectedCardColumnId);
        const selTask = selCol?.tasks.find(t => t.id === selectedCardId);
        if (!selTask || !selectedCardColumnId) return null;
        return <CardDetailModal boardId={board.id} columnId={selectedCardColumnId} task={selTask} onClose={() => setSelectedCardId(null)} onDelete={() => { deleteCard(board.id, selectedCardColumnId, selectedCardId); setSelectedCardId(null); }} />;
      })()}
    </div>
  );
}
