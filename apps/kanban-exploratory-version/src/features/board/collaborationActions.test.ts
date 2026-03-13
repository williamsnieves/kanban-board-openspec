import { useBoardStore } from '@/features/board/useBoardStore'

beforeEach(() => {
  localStorage.clear()
  useBoardStore.setState({ boards: [], currentBoardId: null })
})

function getTask(boardId: string, colId: string, taskId: string) {
  return useBoardStore.getState().boards.find(b => b.id === boardId)!
    .columns.find(c => c.id === colId)!.tasks.find(t => t.id === taskId)!
}

describe('Collaboration store actions', () => {
  let boardId: string, colId: string, taskId: string

  beforeEach(() => {
    const board = useBoardStore.getState().createBoard('Board')!
    boardId = board.id
    colId = board.columns.find(c => c.name === 'Todo')!.id
    const task = useBoardStore.getState().createCard(boardId, colId, 'Task')!
    taskId = task.id
  })

  it('addComment: saves comment with id, text, createdAt, author=You', () => {
    // Arrange — task has no comments
    // Act
    const comment = useBoardStore.getState().addComment(boardId, colId, taskId, 'This needs review')
    // Assert
    expect(comment).not.toBeNull()
    expect(comment!.text).toBe('This needs review')
    expect(comment!.author).toBe('You')
    expect(comment!.id).toBeTruthy()
    expect(comment!.createdAt).toBeTruthy()
    const task = getTask(boardId, colId, taskId)
    expect(task.comments).toHaveLength(1)
    expect(task.comments[0].text).toBe('This needs review')
  })

  it('addComment: empty text returns null, no comment added', () => {
    // Arrange
    // Act
    const result = useBoardStore.getState().addComment(boardId, colId, taskId, '  ')
    // Assert
    expect(result).toBeNull()
    expect(getTask(boardId, colId, taskId).comments).toHaveLength(0)
  })

  it('deleteComment: removes comment by id from task.comments', () => {
    // Arrange
    const comment = useBoardStore.getState().addComment(boardId, colId, taskId, 'Delete me')!
    // Act
    useBoardStore.getState().deleteComment(boardId, colId, taskId, comment.id)
    // Assert
    expect(getTask(boardId, colId, taskId).comments).toHaveLength(0)
  })

  it('addComment: appends to activityLog with action=comment', () => {
    // Arrange
    // Act
    useBoardStore.getState().addComment(boardId, colId, taskId, 'Log this')
    // Assert
    const log = getTask(boardId, colId, taskId).activityLog
    expect(log.length).toBeGreaterThan(0)
    expect(log[log.length - 1].action).toBe('comment')
  })

  it('addSubtask: creates subtask with text and isCompleted=false', () => {
    // Arrange
    // Act
    const subtask = useBoardStore.getState().addSubtask(boardId, colId, taskId, 'Research API')
    // Assert
    expect(subtask).not.toBeNull()
    expect(subtask!.text).toBe('Research API')
    expect(subtask!.isCompleted).toBe(false)
    expect(getTask(boardId, colId, taskId).subtasks).toHaveLength(1)
  })

  it('addSubtask: empty text returns null', () => {
    // Arrange / Act / Assert
    expect(useBoardStore.getState().addSubtask(boardId, colId, taskId, '')).toBeNull()
  })

  it('toggleSubtask: flips isCompleted from false to true', () => {
    // Arrange
    const subtask = useBoardStore.getState().addSubtask(boardId, colId, taskId, 'Step 1')!
    // Act
    useBoardStore.getState().toggleSubtask(boardId, colId, taskId, subtask.id)
    // Assert
    expect(getTask(boardId, colId, taskId).subtasks[0].isCompleted).toBe(true)
  })

  it('toggleSubtask: flips isCompleted from true back to false', () => {
    // Arrange
    const subtask = useBoardStore.getState().addSubtask(boardId, colId, taskId, 'Step 1')!
    useBoardStore.getState().toggleSubtask(boardId, colId, taskId, subtask.id)
    // Act
    useBoardStore.getState().toggleSubtask(boardId, colId, taskId, subtask.id)
    // Assert
    expect(getTask(boardId, colId, taskId).subtasks[0].isCompleted).toBe(false)
  })

  it('deleteSubtask: removes subtask by id', () => {
    // Arrange
    const subtask = useBoardStore.getState().addSubtask(boardId, colId, taskId, 'Remove me')!
    // Act
    useBoardStore.getState().deleteSubtask(boardId, colId, taskId, subtask.id)
    // Assert
    expect(getTask(boardId, colId, taskId).subtasks).toHaveLength(0)
  })

  it('moveCard: appends activityLog entry with action=move containing destination column name', () => {
    // Arrange
    const doneColId = useBoardStore.getState().boards.find(b => b.id === boardId)!
      .columns.find(c => c.name === 'Done')!.id
    // Act
    useBoardStore.getState().moveCard(boardId, colId, doneColId, taskId)
    // Assert — task is now in Done column
    const movedTask = useBoardStore.getState().boards.find(b => b.id === boardId)!
      .columns.find(c => c.id === doneColId)!.tasks.find(t => t.id === taskId)!
    const moveLog = movedTask.activityLog.find(l => l.action === 'move')
    expect(moveLog).toBeDefined()
    expect(moveLog!.details).toContain('Done')
  })

  it('updateTask: appends activityLog entry with action=priority when priority changes', () => {
    // Arrange — task has no priority
    // Act
    useBoardStore.getState().updateTask(boardId, colId, taskId, { priority: 'high' })
    // Assert
    const log = getTask(boardId, colId, taskId).activityLog
    const priorityLog = log.find(l => l.action === 'priority')
    expect(priorityLog).toBeDefined()
    expect(priorityLog!.details).toContain('high')
  })

  it('Persistence: comments and subtasks present in store state after operations', () => {
    // Arrange / Act
    useBoardStore.getState().addComment(boardId, colId, taskId, 'Persist this')
    useBoardStore.getState().addSubtask(boardId, colId, taskId, 'Persist subtask')
    // Assert
    const task = getTask(boardId, colId, taskId)
    expect(task.comments).toHaveLength(1)
    expect(task.subtasks).toHaveLength(1)
  })
})
