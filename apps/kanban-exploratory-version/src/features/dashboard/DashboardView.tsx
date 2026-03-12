import { useBoardStore } from '@/features/board/useBoardStore';
import { BoardList } from '@/features/dashboard/BoardList';
import { CreateBoardForm } from '@/features/dashboard/CreateBoardForm';
import { useThemeStore } from '@/features/theme/useThemeStore';

export function DashboardView() {
  const boards = useBoardStore((s) => s.boards);
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={toggleTheme}>{theme === 'light' ? 'Dark mode' : 'Light mode'}</button>
      <BoardList boards={boards} />
      <CreateBoardForm />
    </div>
  );
}
