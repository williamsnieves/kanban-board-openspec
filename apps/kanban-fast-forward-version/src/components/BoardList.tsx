import { useState } from 'react';
import { useBoardStore } from '../domain/boardStore';

export function BoardList() {
  const boards = useBoardStore((s) => s.boards);
  const selectedBoardId = useBoardStore((s) => s.selectedBoardId);
  const selectBoard = useBoardStore((s) => s.selectBoard);
  const renameBoard = useBoardStore((s) => s.renameBoard);
  const deleteBoard = useBoardStore((s) => s.deleteBoard);

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameError, setRenameError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleRenameSubmit() {
    if (!renameValue.trim()) {
      setRenameError('Board name cannot be empty.');
      return;
    }
    renameBoard(renamingId!, renameValue.trim());
    setRenamingId(null);
    setRenameError('');
  }

  function handleDeleteConfirm() {
    deleteBoard(deletingId!);
    setDeletingId(null);
  }

  return (
    <>
      <ul data-testid="board-list" className="flex flex-col gap-1 p-4">
        {boards.map((board) =>
          renamingId === board.id ? (
            <li key={board.id} className="flex flex-col gap-1 p-1">
              <input
                data-testid="board-rename-input"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                autoFocus
              />
              <div className="flex gap-1">
                <button data-testid="board-rename-submit" onClick={handleRenameSubmit}>Save</button>
                <button data-testid="board-rename-cancel" onClick={() => { setRenamingId(null); setRenameError(''); }}>Cancel</button>
              </div>
              {renameError && <span data-testid="board-rename-error" className="text-red-500 text-xs">{renameError}</span>}
            </li>
          ) : (
            <li key={board.id} className="flex items-center gap-1">
              <button
                data-testid="board-item"
                onClick={() => selectBoard(board.id)}
                className={`flex-1 text-left px-3 py-2 rounded ${
                  selectedBoardId === board.id ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'
                }`}
              >
                {board.name}
              </button>
              <button
                data-testid="board-rename-trigger"
                onClick={() => { setRenamingId(board.id); setRenameValue(board.name); setRenameError(''); }}
              >
                ✏️
              </button>
              <button
                data-testid="board-delete-trigger"
                onClick={() => setDeletingId(board.id)}
              >
                🗑️
              </button>
            </li>
          )
        )}
      </ul>

      {deletingId && (
        <div data-testid="board-delete-dialog" className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 shadow-lg flex flex-col gap-4 min-w-[260px]">
            <p className="font-medium">Delete this board? This cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button data-testid="board-delete-confirm" className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleDeleteConfirm}>Delete</button>
              <button data-testid="board-delete-cancel" className="px-4 py-2 border rounded" onClick={() => setDeletingId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
