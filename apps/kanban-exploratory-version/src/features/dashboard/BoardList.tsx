import { useNavigate } from 'react-router-dom';
import type { Board } from '@/features/board/types';
import { BoardListItem } from '@/features/dashboard/BoardListItem';

interface BoardListProps {
  boards: Board[];
}

export function BoardList({ boards }: BoardListProps) {
  const navigate = useNavigate();

  if (boards.length === 0) {
    return <p>No boards yet. Create your first board.</p>;
  }

  return (
    <ul>
      {boards.map((board) => (
        <BoardListItem
          key={board.id}
          board={board}
          onClick={() => navigate(`/board/${board.id}`)}
        />
      ))}
    </ul>
  );
}
