import { render, fireEvent, cleanup } from '@testing-library/react';
import { TaskCard } from '../components/TaskCard';
import type { Task, Column } from '../domain/types';
import { vi } from 'vitest';

const mockReorderTask = vi.fn();
const mockMoveTask = vi.fn();
const mockStore = {
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  reorderTask: mockReorderTask,
  moveTask: mockMoveTask,
};
vi.mock('../domain/boardStore', () => ({
  useBoardStore: vi.fn((selector: (s: typeof mockStore) => unknown) => selector(mockStore)),
}));

afterEach(cleanup);
beforeEach(() => {
  mockReorderTask.mockClear();
  mockMoveTask.mockClear();
});

const col1: Column = { id: 'col-1', name: 'Todo', position: 0, boardId: 'b1', tasks: [] };
const col2: Column = { id: 'col-2', name: 'In Progress', position: 1, boardId: 'b1', tasks: [] };
const col3: Column = { id: 'col-3', name: 'Done', position: 2, boardId: 'b1', tasks: [] };

describe('Keyboard fallback - same column reorder', () => {
  it('ArrowDown calls reorderTask with position+1', () => {
    // Arrange
    const task: Task = { id: 't1', title: 'Task 1', position: 0, columnId: 'col-1', priority: 'medium' };
    const { getByTestId } = render(
      <TaskCard task={task} columns={[col1, col2]} isFirst={true} isLast={false} />
    );
    // Act
    fireEvent.keyDown(getByTestId('task-card'), { key: 'ArrowDown' });
    // Assert
    expect(mockReorderTask).toHaveBeenCalledWith('col-1', 't1', 1);
  });

  it('ArrowUp calls reorderTask with position-1', () => {
    // Arrange
    const task: Task = { id: 't2', title: 'Task 2', position: 1, columnId: 'col-1', priority: 'medium' };
    const { getByTestId } = render(
      <TaskCard task={task} columns={[col1, col2]} isFirst={false} isLast={true} />
    );
    // Act
    fireEvent.keyDown(getByTestId('task-card'), { key: 'ArrowUp' });
    // Assert
    expect(mockReorderTask).toHaveBeenCalledWith('col-1', 't2', 0);
  });

  it('ArrowDown at last position is a no-op', () => {
    // Arrange
    const task: Task = { id: 't3', title: 'Task 3', position: 1, columnId: 'col-1', priority: 'medium' };
    const { getByTestId } = render(
      <TaskCard task={task} columns={[col1, col2]} isFirst={false} isLast={true} />
    );
    // Act
    fireEvent.keyDown(getByTestId('task-card'), { key: 'ArrowDown' });
    // Assert
    expect(mockReorderTask).not.toHaveBeenCalled();
  });

  it('ArrowUp at first position is a no-op', () => {
    // Arrange
    const task: Task = { id: 't4', title: 'Task 4', position: 0, columnId: 'col-1', priority: 'medium' };
    const { getByTestId } = render(
      <TaskCard task={task} columns={[col1, col2]} isFirst={true} isLast={false} />
    );
    // Act
    fireEvent.keyDown(getByTestId('task-card'), { key: 'ArrowUp' });
    // Assert
    expect(mockReorderTask).not.toHaveBeenCalled();
  });
});

describe('Keyboard fallback - cross-column move', () => {
  it('ArrowRight calls moveTask to next column', () => {
    // Arrange
    const task: Task = { id: 't5', title: 'Task 5', position: 0, columnId: 'col-1', priority: 'medium' };
    const { getByTestId } = render(
      <TaskCard task={task} columns={[col1, col2, col3]} isFirst={true} isLast={true} />
    );
    // Act
    fireEvent.keyDown(getByTestId('task-card'), { key: 'ArrowRight' });
    // Assert
    expect(mockMoveTask).toHaveBeenCalledWith('t5', 'col-2');
  });

  it('ArrowLeft calls moveTask to previous column', () => {
    // Arrange
    const task: Task = { id: 't6', title: 'Task 6', position: 0, columnId: 'col-2', priority: 'medium' };
    const { getByTestId } = render(
      <TaskCard task={task} columns={[col1, col2, col3]} isFirst={true} isLast={true} />
    );
    // Act
    fireEvent.keyDown(getByTestId('task-card'), { key: 'ArrowLeft' });
    // Assert
    expect(mockMoveTask).toHaveBeenCalledWith('t6', 'col-1');
  });

  it('ArrowRight at rightmost column is a no-op', () => {
    // Arrange
    const task: Task = { id: 't7', title: 'Task 7', position: 0, columnId: 'col-3', priority: 'medium' };
    const { getByTestId } = render(
      <TaskCard task={task} columns={[col1, col2, col3]} isFirst={true} isLast={true} />
    );
    // Act
    fireEvent.keyDown(getByTestId('task-card'), { key: 'ArrowRight' });
    // Assert
    expect(mockMoveTask).not.toHaveBeenCalled();
  });

  it('ArrowLeft at leftmost column is a no-op', () => {
    // Arrange
    const task: Task = { id: 't8', title: 'Task 8', position: 0, columnId: 'col-1', priority: 'medium' };
    const { getByTestId } = render(
      <TaskCard task={task} columns={[col1, col2, col3]} isFirst={true} isLast={true} />
    );
    // Act
    fireEvent.keyDown(getByTestId('task-card'), { key: 'ArrowLeft' });
    // Assert
    expect(mockMoveTask).not.toHaveBeenCalled();
  });
});
