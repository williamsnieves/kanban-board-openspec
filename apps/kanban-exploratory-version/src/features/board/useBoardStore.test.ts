import { useBoardStore } from '@/features/board/useBoardStore';

beforeEach(() => {
  localStorage.clear();
  useBoardStore.setState({ boards: [], currentBoardId: null });
});

describe('Create Board', () => {
  it('creates board with valid name and default columns', () => {
    // Arrange
    const { createBoard } = useBoardStore.getState();

    // Act
    const result = createBoard('Project Alpha');

    // Assert
    expect(result).not.toBeNull();
    expect(result?.id).toBeDefined();
    expect(result?.name).toBe('Project Alpha');

    const { boards } = useBoardStore.getState();
    expect(boards).toHaveLength(1);
    expect(boards[0].name).toBe('Project Alpha');

    const columnNames = boards[0].columns.map((c) => c.name);
    expect(columnNames).toEqual(['Todo', 'Doing', 'Done']);
  });

  it('rejects board creation with empty name', () => {
    // Arrange
    const { createBoard } = useBoardStore.getState();

    // Act
    const result = createBoard('');

    // Assert
    expect(result).toBeNull();
    const { boards } = useBoardStore.getState();
    expect(boards).toHaveLength(0);
  });
});

describe('List Boards', () => {
  it('returns all created boards', () => {
    // Arrange
    const { createBoard } = useBoardStore.getState();
    createBoard('Board One');
    createBoard('Board Two');

    // Act
    const { boards } = useBoardStore.getState();

    // Assert
    expect(boards).toHaveLength(2);
    expect(boards.map((b) => b.name)).toEqual(['Board One', 'Board Two']);
  });

  it('returns empty array when no boards exist', () => {
    // Arrange — fresh store via beforeEach

    // Act
    const { boards } = useBoardStore.getState();

    // Assert
    expect(boards).toEqual([]);
  });
});

describe('Mock Persistence', () => {
  it('persists boards to localStorage', () => {
    // Arrange
    const { createBoard } = useBoardStore.getState();

    // Act
    createBoard('Persisted Board');

    // Assert
    const raw = localStorage.getItem('board-storage');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.state.boards).toHaveLength(1);
    expect(parsed.state.boards[0].name).toBe('Persisted Board');
  });
});
