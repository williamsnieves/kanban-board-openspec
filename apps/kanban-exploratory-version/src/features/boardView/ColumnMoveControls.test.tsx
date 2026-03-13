import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useBoardStore } from '@/features/board/useBoardStore';
import { BoardView } from '@/features/boardView/BoardView';

vi.mock('@/features/board/useBoardStore');
vi.mock('@/features/theme/useThemeStore', () => ({
  useThemeStore: () => ({ theme: 'light', toggleTheme: vi.fn() }),
}));

// ─── Store mocks ───────────────────────────────────────────────────────────────

const mockSetCurrentBoard = vi.fn();
const mockCreateCard = vi.fn();
const mockEditCard = vi.fn();
const mockDeleteCard = vi.fn();
const mockMoveCard = vi.fn();
const mockCreateColumn = vi.fn();
const mockRenameColumn = vi.fn();
const mockDeleteColumn = vi.fn();
const mockReorderColumn = vi.fn();

/**
 * Fixture — columns in display order after normalizeColumns:
 *   Todo   (id: 'todo',    index 0, protected)
 *   Doing  (id: 'doing',   index 1, protected)
 *   Done   (id: 'done',    index 2, protected)
 *   Blocked(id: 'blocked', index 3, leftmost custom — boundary for move-left)
 *   Review (id: 'review',  index 4, rightmost custom — boundary for move-right)
 */
const mockBoard = {
  id: 'board-1',
  name: 'Test Board',
  columns: [
    { id: 'todo', name: 'Todo', tasks: [] },
    { id: 'doing', name: 'Doing', tasks: [] },
    { id: 'done', name: 'Done', tasks: [] },
    { id: 'blocked', name: 'Blocked', tasks: [] },
    { id: 'review', name: 'Review', tasks: [{ id: 'card-1', title: 'Some card' }] },
  ],
  createdAt: 0,
};

function setupStoreMock() {
  const mockGetCurrentBoard = vi.fn().mockReturnValue(mockBoard);
  vi.mocked(useBoardStore).mockImplementation(
    ((selector: (s: Record<string, unknown>) => unknown) =>
      selector({
        setCurrentBoard: mockSetCurrentBoard,
        getCurrentBoard: mockGetCurrentBoard,
        createCard: mockCreateCard,
        editCard: mockEditCard,
        deleteCard: mockDeleteCard,
        moveCard: mockMoveCard,
        createColumn: mockCreateColumn,
        renameColumn: mockRenameColumn,
        deleteColumn: mockDeleteColumn,
        reorderColumn: mockReorderColumn,
      })) as unknown as typeof useBoardStore
  );
}

function renderBoardView() {
  return render(
    <MemoryRouter initialEntries={['/board/board-1']}>
      <Routes>
        <Route path="/board/:id" element={<BoardView />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  setupStoreMock();
  mockCreateColumn.mockReturnValue(null);
  mockRenameColumn.mockReturnValue(null);
  mockDeleteColumn.mockReturnValue(null);
  mockReorderColumn.mockReturnValue(null);
});

// ─────────────────────────────────────────────────────────────────────────────
// Requirement: Reorder custom columns — left/right button controls
// ─────────────────────────────────────────────────────────────────────────────

describe('Reorder custom columns — left/right button controls', () => {
  it('Move-left button is present in DOM for both custom and protected columns', () => {
    // Arrange
    renderBoardView();

    // Act — no user interaction needed; buttons are rendered on mount

    // Assert — custom column and protected column both have the button
    expect(screen.getByTestId('column-move-left-blocked')).toBeInTheDocument();
    expect(screen.getByTestId('column-move-left-todo')).toBeInTheDocument();
  });

  it('Move-right button is present in DOM for both custom and protected columns', () => {
    // Arrange
    renderBoardView();

    // Act — no user interaction needed; buttons are rendered on mount

    // Assert — custom column and protected column both have the button
    expect(screen.getByTestId('column-move-right-blocked')).toBeInTheDocument();
    expect(screen.getByTestId('column-move-right-todo')).toBeInTheDocument();
  });

  it('Boundary no-op: move-left on leftmost custom column does not call reorderColumn', async () => {
    // Arrange — Blocked is at display index 3 (leftmost custom position)
    const user = userEvent.setup();
    renderBoardView();

    // Act
    await user.click(screen.getByTestId('column-move-left-blocked'));

    // Assert — silent no-op: store not called, no error shown
    expect(mockReorderColumn).not.toHaveBeenCalled();
    expect(screen.queryByTestId('column-reorder-error')).not.toBeInTheDocument();
  });

  it('Boundary no-op: move-right on rightmost custom column does not call reorderColumn', async () => {
    // Arrange — Review is at display index 4 (rightmost column)
    const user = userEvent.setup();
    renderBoardView();

    // Act
    await user.click(screen.getByTestId('column-move-right-review'));

    // Assert — silent no-op: store not called, no error shown
    expect(mockReorderColumn).not.toHaveBeenCalled();
    expect(screen.queryByTestId('column-reorder-error')).not.toBeInTheDocument();
  });

  it('Clicking move-left on a non-boundary custom column calls reorderColumn with correct args', async () => {
    // Arrange — Review is at display index 4; move-left targets index 3
    const user = userEvent.setup();
    renderBoardView();

    // Act
    await user.click(screen.getByTestId('column-move-left-review'));

    // Assert
    expect(mockReorderColumn).toHaveBeenCalledWith('board-1', 4, 3);
  });

  it('Clicking move button on a protected column shows column-reorder-error without calling store', async () => {
    // Arrange — Todo is at display index 0; protected columns are short-circuited in UI
    const user = userEvent.setup();
    renderBoardView();

    // Act
    await user.click(screen.getByTestId('column-move-left-todo'));

    // Assert — UI short-circuit: store NOT called, error span visible
    expect(mockReorderColumn).not.toHaveBeenCalled();
    expect(screen.getByTestId('column-reorder-error')).toBeInTheDocument();
    expect(screen.getByTestId('column-reorder-error')).toHaveTextContent(
      'Cannot reorder a default column'
    );
  });
});
