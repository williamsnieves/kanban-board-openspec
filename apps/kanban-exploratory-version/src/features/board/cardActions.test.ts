import { useBoardStore } from '@/features/board/useBoardStore';

beforeEach(() => {
  localStorage.clear();
  useBoardStore.setState({ boards: [], currentBoardId: null });
});

describe('Create card with title validation', () => {
  it('creates card with valid title and appends to column', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('Test Board')!;

    // Act
    const task = useBoardStore.getState().createCard(board.id, 'todo', 'Implement login');

    // Assert
    expect(task).not.toBeNull();
    expect(task?.id).toBeDefined();
    expect(task?.title).toBe('Implement login');

    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!;
    const todoColumn = updatedBoard.columns.find((c) => c.id === 'todo')!;
    expect(todoColumn.tasks).toHaveLength(1);
    expect(todoColumn.tasks[0].id).toBe(task?.id);
    expect(todoColumn.tasks[0].title).toBe('Implement login');
  });

  it('rejects empty title', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('Test Board')!;

    // Act
    const task = useBoardStore.getState().createCard(board.id, 'todo', '');

    // Assert
    expect(task).toBeNull();
  });

  it('rejects whitespace-only title', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('Test Board')!;

    // Act
    const task = useBoardStore.getState().createCard(board.id, 'todo', '   ');

    // Assert
    expect(task).toBeNull();
  });
});

describe('Edit card title', () => {
  it('updates title with valid value, preserves id', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('Test Board')!;
    const card = useBoardStore.getState().createCard(board.id, 'todo', 'Old title')!;
    const originalId = card.id;

    // Act
    const result = useBoardStore.getState().editCard(board.id, 'todo', card.id, 'New title');

    // Assert
    expect(result).toBe(true);
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!;
    const todoColumn = updatedBoard.columns.find((c) => c.id === 'todo')!;
    const updatedCard = todoColumn.tasks.find((t) => t.id === originalId)!;
    expect(updatedCard.title).toBe('New title');
    expect(updatedCard.id).toBe(originalId);
  });

  it('rejects empty title, original preserved', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('Test Board')!;
    const card = useBoardStore.getState().createCard(board.id, 'todo', 'Current title')!;

    // Act
    const result = useBoardStore.getState().editCard(board.id, 'todo', card.id, '');

    // Assert
    expect(result).toBe(false);
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!;
    const todoColumn = updatedBoard.columns.find((c) => c.id === 'todo')!;
    const unchanged = todoColumn.tasks.find((t) => t.id === card.id)!;
    expect(unchanged.title).toBe('Current title');
  });

  it('rejects whitespace-only title', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('Test Board')!;
    const card = useBoardStore.getState().createCard(board.id, 'todo', 'Current title')!;

    // Act
    const result = useBoardStore.getState().editCard(board.id, 'todo', card.id, '   ');

    // Assert
    expect(result).toBe(false);
  });
});

describe('Delete card with confirmation', () => {
  it('removes card from column', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('Test Board')!;
    const card = useBoardStore.getState().createCard(board.id, 'todo', 'Task to delete')!;

    // Act
    useBoardStore.getState().deleteCard(board.id, 'todo', card.id);

    // Assert
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!;
    const todoColumn = updatedBoard.columns.find((c) => c.id === 'todo')!;
    expect(todoColumn.tasks.find((t) => t.id === card.id)).toBeUndefined();
    expect(todoColumn.tasks).toHaveLength(0);
  });

  it('state unchanged if deleteCard not called', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('Test Board')!;
    const card = useBoardStore.getState().createCard(board.id, 'todo', 'Persistent task')!;

    // Act — deleteCard is NOT called

    // Assert
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!;
    const todoColumn = updatedBoard.columns.find((c) => c.id === 'todo')!;
    expect(todoColumn.tasks.find((t) => t.id === card.id)).toBeDefined();
  });
});

describe('Move card between columns', () => {
  it('moves card from Todo to Done, appends to end', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('Test Board')!;
    const card = useBoardStore.getState().createCard(board.id, 'todo', 'Move me')!;

    // Act
    useBoardStore.getState().moveCard(board.id, 'todo', 'done', card.id);

    // Assert
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!;
    const todoColumn = updatedBoard.columns.find((c) => c.id === 'todo')!;
    const doneColumn = updatedBoard.columns.find((c) => c.id === 'done')!;

    expect(todoColumn.tasks.find((t) => t.id === card.id)).toBeUndefined();
    expect(doneColumn.tasks).toHaveLength(1);
    expect(doneColumn.tasks[doneColumn.tasks.length - 1].id).toBe(card.id);
  });

  it('same-column move is no-op, no duplicate', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('Test Board')!;
    const card = useBoardStore.getState().createCard(board.id, 'todo', 'Stay here')!;

    // Act
    useBoardStore.getState().moveCard(board.id, 'todo', 'todo', card.id);

    // Assert
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!;
    const todoColumn = updatedBoard.columns.find((c) => c.id === 'todo')!;
    const cardInstances = todoColumn.tasks.filter((t) => t.id === card.id);
    expect(cardInstances).toHaveLength(1);
  });

  it('preserves card id after move', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('Test Board')!;
    const card = useBoardStore.getState().createCard(board.id, 'todo', 'Preserve id')!;
    const originalId = card.id;

    // Act
    useBoardStore.getState().moveCard(board.id, 'todo', 'done', card.id);

    // Assert
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!;
    const doneColumn = updatedBoard.columns.find((c) => c.id === 'done')!;
    expect(doneColumn.tasks[0].id).toBe(originalId);
  });
});
