import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { Board } from '@/features/board/types';
import { useBoardStore } from '@/features/board/useBoardStore';
import { DashboardView } from '@/features/dashboard/DashboardView';

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@/features/board/useBoardStore');

const mockCreateBoard = vi.fn();

function setupMock(boards: Board[]) {
  vi.mocked(useBoardStore).mockImplementation(
    ((selector: (s: { boards: Board[]; createBoard: typeof mockCreateBoard }) => unknown) =>
      selector({ boards, createBoard: mockCreateBoard })) as unknown as typeof useBoardStore
  );
}

beforeEach(() => {
  mockCreateBoard.mockReset();
  mockNavigate.mockReset();
});

describe('List Boards', () => {
  it('shows empty state when no boards exist', () => {
    // Arrange
    setupMock([]);

    // Act
    render(
      <MemoryRouter>
        <DashboardView />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('No boards yet. Create your first board.')).toBeInTheDocument();
  });

  it('shows list of existing boards', () => {
    // Arrange
    setupMock([
      { id: '1', name: 'Project A', columns: [], createdAt: 0 },
      { id: '2', name: 'Project B', columns: [], createdAt: 0 },
    ]);

    // Act
    render(
      <MemoryRouter>
        <DashboardView />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('Project B')).toBeInTheDocument();
  });
});

describe('Create Board', () => {
  it('shows validation error when name is empty', async () => {
    // Arrange
    setupMock([]);
    mockCreateBoard.mockReturnValue(null);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <DashboardView />
      </MemoryRouter>
    );

    // Act
    await user.click(screen.getByRole('button', { name: 'Create' }));

    // Assert
    expect(screen.getByRole('alert')).toHaveTextContent('Board name is required');
  });

  it('creates board with valid name', async () => {
    // Arrange
    setupMock([]);
    mockCreateBoard.mockReturnValue({ id: 'abc', name: 'Project Alpha', columns: [], createdAt: 0 });
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <DashboardView />
      </MemoryRouter>
    );

    // Act
    await user.type(screen.getByPlaceholderText('Board name'), 'Project Alpha');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    // Assert
    expect(mockCreateBoard).toHaveBeenCalledWith('Project Alpha');
    expect(mockNavigate).toHaveBeenCalledWith('/board/abc');
  });
});

describe('Open Board', () => {
  it('navigates to board view when board item is clicked', async () => {
    // Arrange
    setupMock([{ id: '1', name: 'Project X', columns: [], createdAt: 0 }]);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <DashboardView />
      </MemoryRouter>
    );

    // Act
    await user.click(screen.getByRole('button', { name: 'Project X' }));

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/board/1');
  });
});
