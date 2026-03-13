import { useBoardStore } from '@/features/board/useBoardStore'

beforeEach(() => {
  localStorage.clear()
  useBoardStore.setState({ boards: [], currentBoardId: null })
})

// Helper to get a task from store
function getTask(boardId: string, colId: string, taskId: string) {
  return useBoardStore.getState().boards
    .find(b => b.id === boardId)!.columns
    .find(c => c.id === colId)!.tasks
    .find(t => t.id === taskId)!
}

describe('updateTask store action — card metadata', () => {
  let boardId: string
  let colId: string
  let taskId: string

  beforeEach(() => {
    const board = useBoardStore.getState().createBoard('Test Board')!
    boardId = board.id
    colId = board.columns.find(c => c.name === 'Todo')!.id
    const task = useBoardStore.getState().createCard(boardId, colId, 'My Task')!
    taskId = task.id
  })

  it('Set description: saves description, task retains id and title', () => {
    // Arrange — task has no description
    // Act
    const result = useBoardStore.getState().updateTask(boardId, colId, taskId, { description: 'My desc' })
    // Assert
    expect(result).toBe(true)
    const task = getTask(boardId, colId, taskId)
    expect(task.description).toBe('My desc')
    expect(task.id).toBe(taskId)
    expect(task.title).toBe('My Task')
  })

  it('Set labels: saves labels array on task', () => {
    // Arrange
    // Act
    useBoardStore.getState().updateTask(boardId, colId, taskId, { labels: ['bug', 'feature'] })
    // Assert
    expect(getTask(boardId, colId, taskId).labels).toEqual(['bug', 'feature'])
  })

  it('Remove labels: updateTask with empty array clears labels', () => {
    // Arrange
    useBoardStore.getState().updateTask(boardId, colId, taskId, { labels: ['bug'] })
    // Act
    useBoardStore.getState().updateTask(boardId, colId, taskId, { labels: [] })
    // Assert
    expect(getTask(boardId, colId, taskId).labels).toEqual([])
  })

  it('Set due date: saves dueDate string', () => {
    // Arrange
    // Act
    useBoardStore.getState().updateTask(boardId, colId, taskId, { dueDate: '2024-12-31' })
    // Assert
    expect(getTask(boardId, colId, taskId).dueDate).toBe('2024-12-31')
  })

  it('Clear due date: updateTask with undefined dueDate removes it', () => {
    // Arrange
    useBoardStore.getState().updateTask(boardId, colId, taskId, { dueDate: '2024-12-31' })
    // Act
    useBoardStore.getState().updateTask(boardId, colId, taskId, { dueDate: undefined })
    // Assert
    expect(getTask(boardId, colId, taskId).dueDate).toBeUndefined()
  })

  it('Set priority: saves priority value', () => {
    // Arrange
    // Act
    useBoardStore.getState().updateTask(boardId, colId, taskId, { priority: 'high' })
    // Assert
    expect(getTask(boardId, colId, taskId).priority).toBe('high')
  })

  it('Partial update: only provided fields change, others untouched', () => {
    // Arrange
    useBoardStore.getState().updateTask(boardId, colId, taskId, { description: 'desc', labels: ['bug'] })
    // Act
    useBoardStore.getState().updateTask(boardId, colId, taskId, { priority: 'low' })
    // Assert
    const task = getTask(boardId, colId, taskId)
    expect(task.description).toBe('desc')
    expect(task.labels).toEqual(['bug'])
    expect(task.priority).toBe('low')
  })

  it('Non-target columns unaffected: sibling column tasks unchanged', () => {
    // Arrange
    const doingColId = useBoardStore.getState().boards.find(b => b.id === boardId)!.columns.find(c => c.name === 'Doing')!.id
    const otherTask = useBoardStore.getState().createCard(boardId, doingColId, 'Other Task')!
    // Act
    useBoardStore.getState().updateTask(boardId, colId, taskId, { description: 'changed' })
    // Assert
    const sibling = useBoardStore.getState().boards.find(b => b.id === boardId)!.columns.find(c => c.id === doingColId)!.tasks.find(t => t.id === otherTask.id)!
    expect(sibling.description).toBeUndefined()
  })

  it('Persistence: updated fields present in store state after update', () => {
    // Arrange
    // Act
    useBoardStore.getState().updateTask(boardId, colId, taskId, { description: 'persist me', priority: 'medium' })
    // Assert — read from getState (zustand persist covers actual storage)
    const task = getTask(boardId, colId, taskId)
    expect(task.description).toBe('persist me')
    expect(task.priority).toBe('medium')
  })
})
