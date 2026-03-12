import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useBoardStore } from '@/features/board/useBoardStore';
import { BoardView } from '@/features/boardView/BoardView';

vi.mock('@/features/board/useBoardStore');
vi.mock('@/features/theme/useThemeStore', () => ({
  useThemeStore: () => ({ theme: 'light', toggleTheme: vi.fn() }),
}));

const mockSetCurrentBoard = vi.fn();
const mockCreateCard = vi.fn();
const mockEditCard = vi.fn();
const mockDeleteCard = vi.fn();
const mockMoveCard = vi.fn();

const mockBoard = {
  id: 'board-1',
  name: 'Test Board',
  columns: [
    { id: 'todo', name: 'Todo', tasks: [{ id: 'card-1', title: 'Test card' }] },
    { id: 'doing', name: 'Doing', tasks: [] },
    { id: 'done', name: 'Done', tasks: [] },
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
  mockCreateCard.mockImplementation((_: string, __: string, title: string) =>
    title.trim() ? { id: 'new-card', title: title.trim() } : null
  );
  mockEditCard.mockImplementation(
    (_: string, __: string, ___: string, title: string) => title.trim().length > 0
  );
});

describe('Create card with title validation', () => {
  it('calls createCard with valid title', async () => {
    // Arrange
    const user = userEvent.setup();
    renderBoardView();
    const todoHeading = screen.getByRole('heading', { name: 'Todo' });
    const todoColumn = todoHeading.parentElement as HTMLElement;
    // When not editing, there is exactly one textbox inside the Todo column (the add input)
    const addInput = todoColumn.querySelectorAll('input')[0] as HTMLInputElement;

    // Act
    await user.type(addInput, 'New card');
    await user.click(screen.getAllByRole('button', { name: 'Add' })[0]);

    // Assert
    expect(mockCreateCard).toHaveBeenCalledWith('board-1', 'todo', 'New card');
  });

  it('shows validation error for empty title', async () => {
    // Arrange
    const user = userEvent.setup();
    renderBoardView();

    // Act — click Add without typing anything
    await user.click(screen.getAllByRole('button', { name: 'Add' })[0]);

    // Assert
    expect(screen.getByText('Card title is required')).toBeInTheDocument();
  });
});

describe('Edit card title', () => {
  it('calls editCard with valid title', async () => {
    // Arrange
    const user = userEvent.setup();
    renderBoardView();

    // Act
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    // Edit input is the first textbox after entering edit mode
    const editInput = screen.getAllByRole('textbox')[0] as HTMLInputElement;
    await user.clear(editInput);
    await user.type(editInput, 'Updated');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    // Assert
    expect(mockEditCard).toHaveBeenCalledWith('board-1', 'todo', 'card-1', 'Updated');
  });

  it('shows validation error for empty edit', async () => {
    // Arrange
    const user = userEvent.setup();
    renderBoardView();

    // Act
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    const editInput = screen.getAllByRole('textbox')[0] as HTMLInputElement;
    await user.clear(editInput);
    await user.click(screen.getByRole('button', { name: 'Save' }));

    // Assert
    expect(screen.getByText('Card title is required')).toBeInTheDocument();
  });

  it('cancels edit without calling editCard', async () => {
    // Arrange
    const user = userEvent.setup();
    renderBoardView();

    // Act
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    // Assert
    expect(mockEditCard).not.toHaveBeenCalled();
  });
});

describe('Delete card with confirmation', () => {
  it('calls deleteCard when confirmed', async () => {
    // Arrange
    const user = userEvent.setup();
    renderBoardView();

    // Act
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.getByText('Delete this card?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Yes' }));

    // Assert
    expect(mockDeleteCard).toHaveBeenCalledWith('board-1', 'todo', 'card-1');
  });

  it('does not call deleteCard when cancelled', async () => {
    // Arrange
    const user = userEvent.setup();
    renderBoardView();

    // Act
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.getByText('Delete this card?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'No' }));

    // Assert
    expect(mockDeleteCard).not.toHaveBeenCalled();
  });
});

describe('Move card between columns', () => {
  it('calls moveCard when different column selected', async () => {
    // Arrange
    const user = userEvent.setup();
    renderBoardView();
    // Only the Todo column has a card, so there is exactly one <select>
    const moveSelect = screen.getByRole('combobox');

    // Act
    await user.selectOptions(moveSelect, 'done');

    // Assert
    expect(mockMoveCard).toHaveBeenCalledWith('board-1', 'todo', 'done', 'card-1');
  });
});
