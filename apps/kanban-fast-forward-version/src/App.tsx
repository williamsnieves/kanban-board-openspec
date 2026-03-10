import { useBoardStore } from './domain/boardStore';
import { CreateBoardForm } from './components/CreateBoardForm';
import { BoardList } from './components/BoardList';
import { BoardView } from './components/BoardView';

function App() {
  const selectedBoardId = useBoardStore((s) => s.selectedBoardId);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <aside className="w-64 border-r flex flex-col bg-white overflow-hidden">
        <div className="p-3 font-bold text-lg border-b">FlowBoard</div>
        <CreateBoardForm />
        <BoardList />
      </aside>
      <main className="flex-1 overflow-auto">
        {selectedBoardId ? <BoardView /> : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select or create a board to get started.
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
