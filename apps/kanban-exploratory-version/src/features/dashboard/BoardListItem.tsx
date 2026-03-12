import type { Board } from '@/features/board/types';

interface BoardListItemProps {
  board: Board;
  onClick: () => void;
}

export function BoardListItem({ board, onClick }: BoardListItemProps) {
  return (
    <li>
      <button type="button" onClick={onClick}>
        {board.name}
      </button>
    </li>
  );
}
