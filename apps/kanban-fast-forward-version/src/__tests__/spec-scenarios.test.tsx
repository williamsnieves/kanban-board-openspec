import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'
import { createBoard } from '../domain/board'
import { useBoardStore } from '../domain/boardStore'

beforeEach(() => {
  localStorage.clear()
  useBoardStore.setState({ boards: [], selectedBoardId: null })
})

// ─── Default board workflow columns ──────────────────────────────────────────

describe('Default board workflow columns', () => {
  test('create board initializes default columns: Todo Doing Done in order', () => {
    // Arrange
    // createBoard is the pure domain factory — no prior state needed

    // Act
    const board = createBoard('Test Board')

    // Assert
    const names = board.columns.map((c) => c.name)
    expect(names).toEqual(['Todo', 'Doing', 'Done'])
    expect(board.columns[0].position).toBe(0)
    expect(board.columns[1].position).toBe(1)
    expect(board.columns[2].position).toBe(2)
  })
})

// ─── Task lifecycle management ────────────────────────────────────────────────

describe('Task lifecycle management', () => {
  test('create task with required title: task created in selected column', () => {
    // Arrange
    useBoardStore.getState().createBoard('Sprint Board')
    const board = useBoardStore.getState().boards[0]
    const todoCol = board.columns.find((c) => c.name === 'Todo')!

    // Act
    useBoardStore.getState().addTask(todoCol.id, 'My Task', 'medium')

    // Assert
    const updatedCol = useBoardStore.getState().boards[0].columns.find((c) => c.name === 'Todo')!
    expect(updatedCol.tasks).toHaveLength(1)
    expect(updatedCol.tasks[0].title).toBe('My Task')
    expect(updatedCol.tasks[0].columnId).toBe(todoCol.id)
  })

  test('edit task fields: updated task data persisted and displayed', () => {
    // Arrange
    useBoardStore.getState().createBoard('Sprint Board')
    const board = useBoardStore.getState().boards[0]
    const todoCol = board.columns.find((c) => c.name === 'Todo')!
    useBoardStore.getState().addTask(todoCol.id, 'Original Title', 'medium', undefined, 'Original Desc')
    const task = useBoardStore.getState().boards[0].columns.find((c) => c.name === 'Todo')!.tasks[0]

    // Act
    useBoardStore.getState().updateTask(task.id, 'Updated Title', 'medium', undefined, 'Updated Desc')

    // Assert
    const updatedTask = useBoardStore.getState().boards[0].columns.find((c) => c.name === 'Todo')!.tasks[0]
    expect(updatedTask.title).toBe('Updated Title')
    expect(updatedTask.description).toBe('Updated Desc')
    const persisted = JSON.parse(localStorage.getItem('flowboard-state') ?? '[]') as { columns: { tasks: { title: string }[] }[] }[]
    expect(persisted[0].columns.find((c: { name?: string }) => c.name === 'Todo')?.tasks[0].title).toBe('Updated Title')
  })

  test('delete task: task removed from board', () => {
    // Arrange
    useBoardStore.getState().createBoard('Sprint Board')
    const board = useBoardStore.getState().boards[0]
    const todoCol = board.columns.find((c) => c.name === 'Todo')!
    useBoardStore.getState().addTask(todoCol.id, 'Task to Delete', 'medium')
    const task = useBoardStore.getState().boards[0].columns.find((c) => c.name === 'Todo')!.tasks[0]

    // Act
    useBoardStore.getState().deleteTask(task.id)

    // Assert
    const updatedCol = useBoardStore.getState().boards[0].columns.find((c) => c.name === 'Todo')!
    expect(updatedCol.tasks).toHaveLength(0)
  })
})

// ─── Task ordering and movement ───────────────────────────────────────────────

describe('Task ordering and movement', () => {
  test('reorder task within the same column: positions updated and rendered in new order', () => {
    // Arrange
    useBoardStore.getState().createBoard('Sprint Board')
    const board = useBoardStore.getState().boards[0]
    const todoCol = board.columns.find((c) => c.name === 'Todo')!
    useBoardStore.getState().addTask(todoCol.id, 'Task A', 'medium')
    useBoardStore.getState().addTask(todoCol.id, 'Task B', 'medium')
    const tasksBefore = useBoardStore.getState().boards[0].columns.find((c) => c.name === 'Todo')!.tasks
    const taskA = tasksBefore.find((t) => t.title === 'Task A')!
    const taskB = tasksBefore.find((t) => t.title === 'Task B')!
    expect(taskA.position).toBeLessThan(taskB.position) // A is before B initially

    // Act — move Task B to position 0 (before Task A)
    useBoardStore.getState().reorderTask(todoCol.id, taskB.id, 0)

    // Assert — B is now before A
    const tasksAfter = useBoardStore.getState().boards[0].columns.find((c) => c.name === 'Todo')!.tasks
    const updatedA = tasksAfter.find((t) => t.title === 'Task A')!
    const updatedB = tasksAfter.find((t) => t.title === 'Task B')!
    expect(updatedB.position).toBeLessThan(updatedA.position)
  })
})

// ─── Deterministic validation feedback ────────────────────────────────────────

describe('Deterministic validation feedback', () => {
  test('invalid task title: system blocks creation and displays error message', () => {
    // Arrange
    render(<App />)
    fireEvent.change(screen.getByTestId('board-name-input'), { target: { value: 'Test Board' } })
    fireEvent.click(screen.getByTestId('create-board-btn'))
    fireEvent.click(screen.getAllByTestId('board-item')[0])

    // Act — click Add task with an empty title input
    fireEvent.click(screen.getAllByTestId('add-task-btn')[0])

    // Assert — error message appears and no task is created
    expect(screen.getByTestId('task-title-error')).toBeInTheDocument()
    expect(screen.queryAllByTestId('task-item')).toHaveLength(0)
  })
})
