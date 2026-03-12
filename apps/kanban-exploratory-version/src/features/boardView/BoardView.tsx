import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBoardStore } from '@/features/board/useBoardStore';
import { useThemeStore } from '@/features/theme/useThemeStore';

export function BoardView() {
  const { id } = useParams<{ id: string }>();
  const setCurrentBoard = useBoardStore((s) => s.setCurrentBoard);
  const getCurrentBoard = useBoardStore((s) => s.getCurrentBoard);
  const { theme, toggleTheme } = useThemeStore();

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

  return (
    <div>
      <h1>{board.name}</h1>
      <button onClick={toggleTheme}>{theme === 'light' ? 'Dark mode' : 'Light mode'}</button>
      <div>
        {board.columns.map((column) => (
          <div key={column.id}>
            <h2>{column.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
