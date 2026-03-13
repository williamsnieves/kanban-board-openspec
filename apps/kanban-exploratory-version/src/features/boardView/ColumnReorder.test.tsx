import { render, screen, fireEvent } from '@testing-library/react';
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
 * Board fixture — mirrors ColumnManagement.test.tsx fixture:
 *  - Todo, Doing, Done  — protected default columns (display indices 0, 1, 2)
 *  - Blocked            — custom empty column (display index 3)
 *  - Review             — custom non-empty column (display index 4)
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

/**
 * Returns the column container <div> that owns drag handlers and the draggable
 * attribute. The h2 is inside a React fragment so its parentElement is this div.
 */
function getColumnDiv(colName: string): HTMLElement {
  return screen.getByRole('heading', { level: 2, name: colName }).parentElement as HTMLElement;
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
// Requirement: Reorder custom columns via drag-and-drop
// ─────────────────────────────────────────────────────────────────────────────

describe('Reorder custom columns via drag-and-drop', () => {
  it('Custom column has draggable="true" attribute in DOM', () => {
    // Arrange
    renderBoardView();

    // Act — no user interaction needed; attribute is set on render

    // Assert
    expect(getColumnDiv('Blocked')).toHaveAttribute('draggable', 'true');
  });

  it('Protected column (Todo/Doing/Done) has draggable="false" attribute in DOM', () => {
    // Arrange
    renderBoardView();

    // Act — no user interaction needed; attribute is set on render

    // Assert
    expect(getColumnDiv('Todo')).toHaveAttribute('draggable', 'false');
    expect(getColumnDiv('Doing')).toHaveAttribute('draggable', 'false');
    expect(getColumnDiv('Done')).toHaveAttribute('draggable', 'false');
  });

  it('Firing dragstart + drop events on a custom column calls reorderColumn with correct args', () => {
    // Arrange
    renderBoardView();
    const blockedDiv = getColumnDiv('Blocked'); // display index 3
    const reviewDiv = getColumnDiv('Review');   // display index 4

    // Act
    fireEvent.dragStart(blockedDiv);
    fireEvent.drop(reviewDiv);

    // Assert
    expect(mockReorderColumn).toHaveBeenCalledWith('board-1', 3, 4);
  });

  it('When reorderColumn mock returns an error string, column-reorder-error is visible', () => {
    // Arrange
    mockReorderColumn.mockReturnValue('Cannot reorder a default column');
    renderBoardView();
    const blockedDiv = getColumnDiv('Blocked'); // display index 3
    const reviewDiv = getColumnDiv('Review');   // display index 4

    // Act
    fireEvent.dragStart(blockedDiv);
    fireEvent.drop(reviewDiv);

    // Assert
    expect(screen.getByTestId('column-reorder-error')).toBeInTheDocument();
    expect(screen.getByTestId('column-reorder-error')).toHaveTextContent(
      'Cannot reorder a default column'
    );
  });
});
