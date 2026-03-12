import { useBoardStore } from './domain/boardStore';
import { CreateBoardForm } from './components/CreateBoardForm';
import { BoardList } from './components/BoardList';
import { BoardView } from './components/BoardView';

function App() {
  const selectedBoardId = useBoardStore((s) => s.selectedBoardId);
  const boards = useBoardStore((s) => s.boards);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <aside className="w-64 border-r flex flex-col bg-white overflow-hidden">
        <div className="p-3 font-bold text-lg border-b">FlowBoard</div>
        <CreateBoardForm />
        <BoardList />
      </aside>
      <main className="flex-1 overflow-auto">
        {boards.length === 0 ? (
          <div data-testid="empty-state-no-boards" className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
            <p className="text-lg font-medium">No boards yet</p>
            <button
              data-testid="empty-state-create-board-cta"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create your first board
            </button>
          </div>
        ) : selectedBoardId ? (
          <BoardView />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a board to get started.
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
