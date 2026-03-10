import { useState } from 'react';
import { useBoardStore } from '../domain/boardStore';

export function CreateBoardForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const createBoard = useBoardStore((s) => s.createBoard);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Board name is required');
      return;
    }
    createBoard(name.trim());
    setName('');
    setError('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4">
      <div className="flex gap-2">
        <input
          data-testid="board-name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Board name"
          className="border rounded px-2 py-1 flex-1"
        />
        <button
          data-testid="create-board-btn"
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Create
        </button>
      </div>
      {error && (
        <span data-testid="board-name-error" className="text-red-500 text-sm">
          {error}
        </span>
      )}
    </form>
  );
}
