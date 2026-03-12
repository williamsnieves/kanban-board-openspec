import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBoardStore } from '@/features/board/useBoardStore';
import { useThemeStore } from '@/features/theme/useThemeStore';
import { normalizeColumns } from '@/features/board/normalizeColumns';

export function BoardView() {
  const { id } = useParams<{ id: string }>();
  const setCurrentBoard = useBoardStore((s) => s.setCurrentBoard);
  const getCurrentBoard = useBoardStore((s) => s.getCurrentBoard);
  const createCard = useBoardStore((s) => s.createCard);
  const editCard = useBoardStore((s) => s.editCard);
  const deleteCard = useBoardStore((s) => s.deleteCard);
  const moveCard = useBoardStore((s) => s.moveCard);
  const { theme, toggleTheme } = useThemeStore();

  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
  const [addTitle, setAddTitle] = useState<Record<string, string>>({});
  const [editTitle, setEditTitle] = useState('');
  const [addError, setAddError] = useState<Record<string, string>>({});
  const [editError, setEditError] = useState('');

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

  return (
    <div>
      <h1>{board.name}</h1>
      <button onClick={toggleTheme}>{theme === 'light' ? 'Dark mode' : 'Light mode'}</button>
      <div>
        {displayColumns.map((column) => (
          <div key={column.id}>
            <h2>{column.name}</h2>
            {column.tasks.length === 0 ? (
              <p>No tasks</p>
            ) : (
              <ul>
                {column.tasks.map((task) => (
                  <li key={task.id}>
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
                        <span>{task.title}</span>
                        <button onClick={() => handleEditStart(task.id, task.title)}>Edit</button>
                        <button onClick={() => handleDeleteStart(task.id)}>Delete</button>
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
            <div>
              <input
                value={addTitle[column.id] ?? ''}
                onChange={(e) =>
                  setAddTitle((prev) => ({ ...prev, [column.id]: e.target.value }))
                }
              />
              {addError[column.id] && <span>{addError[column.id]}</span>}
              <button onClick={() => handleAddCard(column.id)}>Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
