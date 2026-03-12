import { act } from 'react'
import { useBoardStore } from '../domain/boardStore'
import { loadState, saveState } from '../domain/storage'

const makeBoard = () => ({
  id: 'b1', name: 'B', createdAt: new Date().toISOString(),
  columns: [{ id: 'c1', name: 'Todo', position: 0, boardId: 'b1', tasks: [] }]
})

beforeEach(() => {
  localStorage.clear()
  act(() => { useBoardStore.setState({ boards: [makeBoard()], selectedBoardId: 'b1' }) })
})

describe('Task priority catalog', () => {
  it('Set valid priority on task creation', () => {
    // Arrange
    const { addTask, boards } = useBoardStore.getState()
    const columnId = boards[0].columns[0].id

    // Act
    act(() => { addTask(columnId, 'My Task', 'high') })

    // Assert
    const task = useBoardStore.getState().boards[0].columns[0].tasks[0]
    expect(task.priority).toBe('high')
  })

  it('Reject invalid priority value', () => {
    // Arrange
    const { boards } = useBoardStore.getState()
    const columnId = boards[0].columns[0].id
    const before = useBoardStore.getState().boards[0].columns[0].tasks.length

    // Act — call addTask with invalid priority
    act(() => { (useBoardStore.getState().addTask as (c: string, t: string, p: string) => void)(columnId, 'Bad Task', 'critical') })

    // Assert — no task written
    const after = useBoardStore.getState().boards[0].columns[0].tasks.length
    expect(after).toBe(before)
  })
})

describe('Optional due date metadata', () => {
  it('Create task with due date', () => {
    // Arrange
    const { boards } = useBoardStore.getState()
    const columnId = boards[0].columns[0].id

    // Act
    act(() => { useBoardStore.getState().addTask(columnId, 'Task With Date', 'medium', '2026-06-15') })

    // Assert
    const task = useBoardStore.getState().boards[0].columns[0].tasks[0]
    expect(task.dueDate).toBe('2026-06-15')
  })

  it('Edit due date on existing task', () => {
    // Arrange
    const { boards } = useBoardStore.getState()
    const columnId = boards[0].columns[0].id
    act(() => { useBoardStore.getState().addTask(columnId, 'Task', 'low', '2026-01-01') })
    const taskId = useBoardStore.getState().boards[0].columns[0].tasks[0].id

    // Act
    act(() => { useBoardStore.getState().updateTask(taskId, 'Task', 'low', '2026-12-31') })

    // Assert
    const task = useBoardStore.getState().boards[0].columns[0].tasks[0]
    expect(task.dueDate).toBe('2026-12-31')
  })
})

describe('Local-first metadata persistence', () => {
  it('Restore metadata after reload — legacy task without priority defaults to medium', () => {
    // Arrange — write a task without priority to localStorage
    const legacyBoard = {
      id: 'b2', name: 'Legacy', createdAt: new Date().toISOString(),
      columns: [{
        id: 'c2', name: 'Todo', position: 0, boardId: 'b2',
        tasks: [{ id: 't1', title: 'Old Task', position: 0, columnId: 'c2' }]
      }]
    }
    saveState([legacyBoard] as Parameters<typeof saveState>[0])

    // Act
    const loaded = loadState()

    // Assert
    expect(loaded![0].columns[0].tasks[0].priority).toBe('medium')
  })
})
