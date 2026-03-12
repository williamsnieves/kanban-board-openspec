import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoardStore } from '@/features/board/useBoardStore';

export function CreateBoardForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const createBoard = useBoardStore((s) => s.createBoard);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const board = createBoard(name);
    if (!board) {
      setError('Board name is required');
      return;
    }
    setError('');
    setName('');
    navigate(`/board/${board.id}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Board name"
      />
      <button type="submit">Create</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
