import { render, screen, within } from '@testing-library/react';
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

/**
 * Board fixture:
 *  - Todo, Doing, Done  — protected default columns (empty)
 *  - Blocked            — custom empty column
 *  - Review             — custom non-empty column (1 card)
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
 * Returns the <div> that wraps h2 + Rename + Delete controls for a column
 * (only usable when the column is NOT in rename mode).
 */
function getColumnHeaderDiv(colName: string): HTMLElement {
  return screen.getByRole('heading', { level: 2, name: colName }).parentElement as HTMLElement;
}

/**
 * Returns the <div> that wraps the "Add column" input + button at board level.
 */
function getAddColumnSection(): HTMLElement {
  return screen.getByRole('button', { name: 'Add column' }).parentElement as HTMLElement;
}

beforeEach(() => {
  vi.clearAllMocks();
  setupStoreMock();
  // Default: all column actions succeed
  mockCreateColumn.mockReturnValue(null);
  mockRenameColumn.mockReturnValue(null);
  mockDeleteColumn.mockReturnValue(null);
});

// ─────────────────────────────────────────────────────────────────────────────
// Requirement: Create custom column
// ─────────────────────────────────────────────────────────────────────────────

describe('Create custom column', () => {
  it('Create column input renders in board view', () => {
    // Arrange
    renderBoardView();
    const section = getAddColumnSection();

    // Act — no user interaction needed

    // Assert
    expect(within(section).getByRole('textbox')).toBeInTheDocument();
    expect(within(section).getByRole('button', { name: 'Add column' })).toBeInTheDocument();
  });

  it('Create column with valid unique name — calls createColumn and clears input', async () => {
    // Arrange
    const user = userEvent.setup();
    renderBoardView();
    const section = getAddColumnSection();
    const input = within(section).getByRole('textbox');

    // Act
    await user.type(input, 'Staging');
    await user.click(within(section).getByRole('button', { name: 'Add column' }));

    // Assert
    expect(mockCreateColumn).toHaveBeenCalledWith('board-1', 'Staging');
    expect(input).toHaveValue('');
  });

  it('Reject empty column name on create — validation feedback is shown', async () => {
    // Arrange
    const user = userEvent.setup();
    renderBoardView();
    const section = getAddColumnSection();

    // Act — submit without typing (input value is '')
    await user.click(within(section).getByRole('button', { name: 'Add column' }));

    // Assert — local validation short-circuits before calling store
    expect(mockCreateColumn).not.toHaveBeenCalled();
    expect(within(section).getByText('Column name is required')).toBeInTheDocument();
  });

  it('Reject whitespace-only column name on create — validation feedback is shown', async () => {
    // Arrange
    mockCreateColumn.mockReturnValue('Column name is required');
    const user = userEvent.setup();
    renderBoardView();
    const section = getAddColumnSection();
    const input = within(section).getByRole('textbox');

    // Act
    await user.type(input, '   ');
    await user.click(within(section).getByRole('button', { name: 'Add column' }));

    // Assert
    expect(within(section).getByText('Column name is required')).toBeInTheDocument();
  });

  it('Reject duplicate column name on create — duplicate-name validation feedback is shown', async () => {
    // Arrange
    mockCreateColumn.mockReturnValue('Column name already exists');
    const user = userEvent.setup();
    renderBoardView();
    const section = getAddColumnSection();
    const input = within(section).getByRole('textbox');

    // Act
    await user.type(input, 'todo');
    await user.click(within(section).getByRole('button', { name: 'Add column' }));

    // Assert
    expect(within(section).getByText('Column name already exists')).toBeInTheDocument();
  });

  it('No error shown when create succeeds', async () => {
    // Arrange
    mockCreateColumn.mockReturnValue(null);
    const user = userEvent.setup();
    renderBoardView();
    const section = getAddColumnSection();
    const input = within(section).getByRole('textbox');

    // Act
    await user.type(input, 'Staging');
    await user.click(within(section).getByRole('button', { name: 'Add column' }));

    // Assert — no error text rendered
    expect(within(section).queryByText('Column name is required')).not.toBeInTheDocument();
    expect(within(section).queryByText('Column name already exists')).not.toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Requirement: Rename custom column
// ─────────────────────────────────────────────────────────────────────────────

describe('Rename custom column', () => {
  it('Rename button triggers rename input — column heading replaced by input', async () => {
    // Arrange
    const user = userEvent.setup();
    renderBoardView();

    // Act
    await user.click(within(getColumnHeaderDiv('Blocked')).getByRole('button', { name: 'Rename' }));

    // Assert — rename input visible, pre-filled; original h2 gone
    expect(screen.getByDisplayValue('Blocked')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2, name: 'Blocked' })).not.toBeInTheDocument();
  });

  it('Rename column with valid unique name — renameColumn called with correct args', async () => {
    // Arrange
    const user = userEvent.setup();
    renderBoardView();
    await user.click(within(getColumnHeaderDiv('Blocked')).getByRole('button', { name: 'Rename' }));

    // Act
    const renameInput = screen.getByDisplayValue('Blocked');
    await user.clear(renameInput);
    await user.type(renameInput, 'QA');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    // Assert
    expect(mockRenameColumn).toHaveBeenCalledWith('board-1', 'blocked', 'QA');
  });

  it('Rename column succeeds — rename form dismissed', async () => {
    // Arrange
    mockRenameColumn.mockReturnValue(null);
    const user = userEvent.setup();
    renderBoardView();
    await user.click(within(getColumnHeaderDiv('Blocked')).getByRole('button', { name: 'Rename' }));

    // Act
    const renameInput = screen.getByDisplayValue('Blocked');
    await user.clear(renameInput);
    await user.type(renameInput, 'QA');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    // Assert — rename input dismissed; Save button gone
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue('QA')).not.toBeInTheDocument();
  });

  it('Reject invalid rename with empty value — validation feedback shown', async () => {
    // Arrange
    mockRenameColumn.mockReturnValue('Column name is required');
    const user = userEvent.setup();
    renderBoardView();
    await user.click(within(getColumnHeaderDiv('Blocked')).getByRole('button', { name: 'Rename' }));

    // Act
    const renameInput = screen.getByDisplayValue('Blocked');
    await user.clear(renameInput);
    await user.click(screen.getByRole('button', { name: 'Save' }));

    // Assert
    expect(screen.getByText('Column name is required')).toBeInTheDocument();
  });

  it('Reject duplicate rename (case-insensitive) — validation feedback shown', async () => {
    // Arrange
    mockRenameColumn.mockReturnValue('Column name already exists');
    const user = userEvent.setup();
    renderBoardView();
    await user.click(within(getColumnHeaderDiv('Blocked')).getByRole('button', { name: 'Rename' }));

    // Act
    const renameInput = screen.getByDisplayValue('Blocked');
    await user.clear(renameInput);
    await user.type(renameInput, 'todo');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    // Assert
    expect(screen.getByText('Column name already exists')).toBeInTheDocument();
  });

  it('Cancel rename restores column header — rename form dismissed without call', async () => {
    // Arrange
    const user = userEvent.setup();
    renderBoardView();
    await user.click(within(getColumnHeaderDiv('Blocked')).getByRole('button', { name: 'Rename' }));
    expect(screen.getByDisplayValue('Blocked')).toBeInTheDocument();

    // Act
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    // Assert — rename form gone; Blocked heading restored; renameColumn never called
    expect(screen.queryByDisplayValue('Blocked')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Blocked' })).toBeInTheDocument();
    expect(mockRenameColumn).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Requirement: Delete only empty columns
// ─────────────────────────────────────────────────────────────────────────────

describe('Delete only empty columns', () => {
  it('Delete column button triggers confirm UI', async () => {
    // Arrange
    const user = userEvent.setup();
    renderBoardView();

    // Act
    await user.click(within(getColumnHeaderDiv('Blocked')).getByRole('button', { name: 'Delete column' }));

    // Assert — confirm prompt visible
    expect(screen.getByText('Delete column?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
  });

  it('Delete an empty custom column — deleteColumn called with correct args', async () => {
    // Arrange
    mockDeleteColumn.mockReturnValue(null);
    const user = userEvent.setup();
    renderBoardView();

    // Act
    await user.click(within(getColumnHeaderDiv('Blocked')).getByRole('button', { name: 'Delete column' }));
    await user.click(screen.getByRole('button', { name: 'Yes' }));

    // Assert
    expect(mockDeleteColumn).toHaveBeenCalledWith('board-1', 'blocked');
  });

  it('Delete empty custom column succeeds — confirm UI dismissed', async () => {
    // Arrange
    mockDeleteColumn.mockReturnValue(null);
    const user = userEvent.setup();
    renderBoardView();

    // Act
    await user.click(within(getColumnHeaderDiv('Blocked')).getByRole('button', { name: 'Delete column' }));
    await user.click(screen.getByRole('button', { name: 'Yes' }));

    // Assert — confirm prompt gone
    expect(screen.queryByText('Delete column?')).not.toBeInTheDocument();
  });

  it('Prevent deleting a non-empty custom column — error feedback shown', async () => {
    // Arrange
    mockDeleteColumn.mockReturnValue('Cannot delete a column with cards');
    const user = userEvent.setup();
    renderBoardView();

    // Act
    await user.click(within(getColumnHeaderDiv('Review')).getByRole('button', { name: 'Delete column' }));
    await user.click(screen.getByRole('button', { name: 'Yes' }));

    // Assert — error message visible; confirm UI dismissed
    expect(screen.getByText('Cannot delete a column with cards')).toBeInTheDocument();
    expect(screen.queryByText('Delete column?')).not.toBeInTheDocument();
  });

  it('Cancel delete dismisses confirm UI — deleteColumn not called', async () => {
    // Arrange
    const user = userEvent.setup();
    renderBoardView();
    await user.click(within(getColumnHeaderDiv('Blocked')).getByRole('button', { name: 'Delete column' }));
    expect(screen.getByText('Delete column?')).toBeInTheDocument();

    // Act
    await user.click(screen.getByRole('button', { name: 'No' }));

    // Assert — confirm prompt gone; deleteColumn never called
    expect(screen.queryByText('Delete column?')).not.toBeInTheDocument();
    expect(mockDeleteColumn).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Requirement: Protect default columns from deletion
// ─────────────────────────────────────────────────────────────────────────────

describe('Protect default columns from deletion', () => {
  it('Attempt to delete protected default column "Todo" — error feedback shown', async () => {
    // Arrange
    mockDeleteColumn.mockReturnValue('Cannot delete a default column');
    const user = userEvent.setup();
    renderBoardView();

    // Act
    await user.click(within(getColumnHeaderDiv('Todo')).getByRole('button', { name: 'Delete column' }));
    await user.click(screen.getByRole('button', { name: 'Yes' }));

    // Assert
    expect(screen.getByText('Cannot delete a default column')).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Mutual exclusivity of renamingColumnId and deletingColumnId
// ─────────────────────────────────────────────────────────────────────────────

describe('Reorder excluded from this change', () => {
  it('Scope validation: renamingColumnId and deletingColumnId are mutually exclusive', async () => {
    // Arrange
    const user = userEvent.setup();
    renderBoardView();

    // Act — start rename on Blocked, then start delete on Todo
    await user.click(within(getColumnHeaderDiv('Blocked')).getByRole('button', { name: 'Rename' }));
    expect(screen.getByDisplayValue('Blocked')).toBeInTheDocument();

    await user.click(within(getColumnHeaderDiv('Todo')).getByRole('button', { name: 'Delete column' }));

    // Assert — Blocked rename input dismissed; Todo delete confirm visible
    expect(screen.queryByDisplayValue('Blocked')).not.toBeInTheDocument();
    expect(screen.getByText('Delete column?')).toBeInTheDocument();
  });

  it('Scope validation: opening rename clears any active delete confirm', async () => {
    // Arrange
    const user = userEvent.setup();
    renderBoardView();

    // Act — start delete on Blocked, then start rename on Doing
    await user.click(within(getColumnHeaderDiv('Blocked')).getByRole('button', { name: 'Delete column' }));
    expect(screen.getByText('Delete column?')).toBeInTheDocument();

    await user.click(within(getColumnHeaderDiv('Doing')).getByRole('button', { name: 'Rename' }));

    // Assert — Blocked delete confirm dismissed; Doing rename input visible
    expect(screen.queryByText('Delete column?')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('Doing')).toBeInTheDocument();
  });
});
