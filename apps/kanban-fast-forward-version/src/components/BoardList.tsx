import { useBoardStore } from '../domain/boardStore';

export function BoardList() {
  const boards = useBoardStore((s) => s.boards);
  const selectedBoardId = useBoardStore((s) => s.selectedBoardId);
  const selectBoard = useBoardStore((s) => s.selectBoard);

  return (
    <ul data-testid="board-list" className="flex flex-col gap-1 p-4">
      {boards.map((board) => (
        <li key={board.id}>
          <button
            data-testid="board-item"
            onClick={() => selectBoard(board.id)}
            className={`w-full text-left px-3 py-2 rounded ${
              selectedBoardId === board.id ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'
            }`}
          >
            {board.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
