import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { Board } from '@/features/board/types';
import { useBoardStore } from '@/features/board/useBoardStore';
import { BoardView } from '@/features/boardView/BoardView';

vi.mock('@/features/board/useBoardStore');

const mockSetCurrentBoard = vi.fn();
const mockGetCurrentBoard = vi.fn();

function setupMock(board: Board | undefined) {
  vi.mocked(useBoardStore).mockImplementation(
    ((selector: (s: { setCurrentBoard: typeof mockSetCurrentBoard; getCurrentBoard: typeof mockGetCurrentBoard }) => unknown) =>
      selector({ setCurrentBoard: mockSetCurrentBoard, getCurrentBoard: mockGetCurrentBoard })) as unknown as typeof useBoardStore
  );
  mockGetCurrentBoard.mockReturnValue(board);
}

beforeEach(() => {
  mockSetCurrentBoard.mockReset();
  mockGetCurrentBoard.mockReset();
});

describe('Open Board', () => {
  it('renders board columns when board exists', () => {
    // Arrange
    const board: Board = {
      id: 'board-1',
      name: 'Project Alpha',
      columns: [
        { id: 'todo', name: 'Todo', tasks: [] },
        { id: 'doing', name: 'Doing', tasks: [] },
        { id: 'done', name: 'Done', tasks: [] },
      ],
      createdAt: 0,
    };
    setupMock(board);

    // Act
    render(
      <MemoryRouter initialEntries={['/board/board-1']}>
        <Routes>
          <Route path="/board/:id" element={<BoardView />} />
        </Routes>
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByRole('heading', { level: 1, name: 'Project Alpha' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Todo' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Doing' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Done' })).toBeInTheDocument();
  });

  it('shows not found message when board id is unknown', () => {
    // Arrange
    setupMock(undefined);

    // Act
    render(
      <MemoryRouter initialEntries={['/board/unknown-id']}>
        <Routes>
          <Route path="/board/:id" element={<BoardView />} />
        </Routes>
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('Board not found.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to Dashboard' })).toBeInTheDocument();
  });
});
