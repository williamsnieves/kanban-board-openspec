import { useBoardStore } from '@/features/board/useBoardStore'

beforeEach(() => {
  localStorage.clear()
  useBoardStore.setState({ boards: [], currentBoardId: null })
})

// ─────────────────────────────────────────────────────────────────────────────
// Requirement: Reorder tasks within a column — reorderTask store action
// ─────────────────────────────────────────────────────────────────────────────

describe('Reorder tasks within a column — reorderTask store action', () => {
  it('Upward reorder (task 5.1): task at index 2 moves to index 0, resulting order is [C,A,B]', () => {
    // Arrange — board with Todo column containing tasks [A, B, C]
    const board = useBoardStore.getState().createBoard('My Board')!
    const colId = useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns.find((c) => c.name === 'Todo')!.id
    const taskA = useBoardStore.getState().createCard(board.id, colId, 'A')!
    const taskB = useBoardStore.getState().createCard(board.id, colId, 'B')!
    const taskC = useBoardStore.getState().createCard(board.id, colId, 'C')!

    // Act — move task at index 2 (C) to index 0
    const error = (useBoardStore.getState() as any).reorderTask(board.id, colId, 2, 0)

    // Assert — no error, tasks in order [C, A, B]
    expect(error).toBeNull()
    const tasks = useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns.find((c) => c.id === colId)!.tasks
    expect(tasks[0].id).toBe(taskC.id)
    expect(tasks[1].id).toBe(taskA.id)
    expect(tasks[2].id).toBe(taskB.id)
  })

  it('Downward reorder (task 5.2): task at index 0 moves to index 2, resulting order is [B,C,A]', () => {
    // Arrange — board with Todo column containing tasks [A, B, C]
    const board = useBoardStore.getState().createBoard('My Board')!
    const colId = useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns.find((c) => c.name === 'Todo')!.id
    const taskA = useBoardStore.getState().createCard(board.id, colId, 'A')!
    const taskB = useBoardStore.getState().createCard(board.id, colId, 'B')!
    const taskC = useBoardStore.getState().createCard(board.id, colId, 'C')!

    // Act — move task at index 0 (A) to index 2
    const error = (useBoardStore.getState() as any).reorderTask(board.id, colId, 0, 2)

    // Assert — no error, tasks in order [B, C, A]
    expect(error).toBeNull()
    const tasks = useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns.find((c) => c.id === colId)!.tasks
    expect(tasks[0].id).toBe(taskB.id)
    expect(tasks[1].id).toBe(taskC.id)
    expect(tasks[2].id).toBe(taskA.id)
  })

  it('Same-index no-op (task 5.3): reorderTask with same source and destination returns null, order [A,B,C] unchanged', () => {
    // Arrange — board with Todo column containing tasks [A, B, C]
    const board = useBoardStore.getState().createBoard('My Board')!
    const colId = useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns.find((c) => c.name === 'Todo')!.id
    const taskA = useBoardStore.getState().createCard(board.id, colId, 'A')!
    const taskB = useBoardStore.getState().createCard(board.id, colId, 'B')!
    const taskC = useBoardStore.getState().createCard(board.id, colId, 'C')!

    // Act — move task at index 1 to index 1 (no-op)
    const error = (useBoardStore.getState() as any).reorderTask(board.id, colId, 1, 1)

    // Assert — no error, tasks order unchanged [A, B, C]
    expect(error).toBeNull()
    const tasks = useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns.find((c) => c.id === colId)!.tasks
    expect(tasks[0].id).toBe(taskA.id)
    expect(tasks[1].id).toBe(taskB.id)
    expect(tasks[2].id).toBe(taskC.id)
  })

  it('Out-of-range source (task 5.4a): sourceIndex 99 returns non-null error string, order [A,B,C] unchanged', () => {
    // Arrange — board with Todo column containing tasks [A, B, C]
    const board = useBoardStore.getState().createBoard('My Board')!
    const colId = useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns.find((c) => c.name === 'Todo')!.id
    const taskA = useBoardStore.getState().createCard(board.id, colId, 'A')!
    const taskB = useBoardStore.getState().createCard(board.id, colId, 'B')!
    const taskC = useBoardStore.getState().createCard(board.id, colId, 'C')!

    // Act — attempt to move from out-of-range source index 99
    const error = (useBoardStore.getState() as any).reorderTask(board.id, colId, 99, 0)

    // Assert — error is a non-null string, order unchanged [A, B, C]
    expect(error).not.toBeNull()
    expect(typeof error).toBe('string')
    const tasks = useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns.find((c) => c.id === colId)!.tasks
    expect(tasks[0].id).toBe(taskA.id)
    expect(tasks[1].id).toBe(taskB.id)
    expect(tasks[2].id).toBe(taskC.id)
  })

  it('Out-of-range destination (task 5.4b): destinationIndex 99 returns non-null error string, order [A,B,C] unchanged', () => {
    // Arrange — board with Todo column containing tasks [A, B, C]
    const board = useBoardStore.getState().createBoard('My Board')!
    const colId = useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns.find((c) => c.name === 'Todo')!.id
    const taskA = useBoardStore.getState().createCard(board.id, colId, 'A')!
    const taskB = useBoardStore.getState().createCard(board.id, colId, 'B')!
    const taskC = useBoardStore.getState().createCard(board.id, colId, 'C')!

    // Act — attempt to move to out-of-range destination index 99
    const error = (useBoardStore.getState() as any).reorderTask(board.id, colId, 0, 99)

    // Assert — error is a non-null string, order unchanged [A, B, C]
    expect(error).not.toBeNull()
    expect(typeof error).toBe('string')
    const tasks = useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns.find((c) => c.id === colId)!.tasks
    expect(tasks[0].id).toBe(taskA.id)
    expect(tasks[1].id).toBe(taskB.id)
    expect(tasks[2].id).toBe(taskC.id)
  })

  it('Task identity preserved (task 5.5): moved task at new index has same id and title as original', () => {
    // Arrange — board with Todo column containing tasks [A, B, C]
    const board = useBoardStore.getState().createBoard('My Board')!
    const colId = useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns.find((c) => c.name === 'Todo')!.id
    useBoardStore.getState().createCard(board.id, colId, 'A')
    useBoardStore.getState().createCard(board.id, colId, 'B')
    const taskC = useBoardStore.getState().createCard(board.id, colId, 'C')!

    // Act — move task at index 2 (C) to index 0
    ;(useBoardStore.getState() as any).reorderTask(board.id, colId, 2, 0)

    // Assert — task at index 0 has same id and title as original taskC
    const tasks = useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns.find((c) => c.id === colId)!.tasks
    expect(tasks[0].id).toBe(taskC.id)
    expect(tasks[0].title).toBe(taskC.title)
  })

  it('Non-target columns unaffected (task 5.6): reordering Alpha tasks leaves Beta tasks unchanged', () => {
    // Arrange — board with 2 custom columns Alpha and Beta, each with tasks
    const board = useBoardStore.getState().createBoard('My Board')!
    useBoardStore.getState().createColumn(board.id, 'Alpha')
    useBoardStore.getState().createColumn(board.id, 'Beta')
    const alphaColId = useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns.find((c) => c.name === 'Alpha')!.id
    const betaColId = useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns.find((c) => c.name === 'Beta')!.id
    useBoardStore.getState().createCard(board.id, alphaColId, 'Alpha-1')
    useBoardStore.getState().createCard(board.id, alphaColId, 'Alpha-2')
    useBoardStore.getState().createCard(board.id, alphaColId, 'Alpha-3')
    const beta1 = useBoardStore.getState().createCard(board.id, betaColId, 'Beta-1')!
    const beta2 = useBoardStore.getState().createCard(board.id, betaColId, 'Beta-2')!

    // Act — reorder tasks within Alpha column
    ;(useBoardStore.getState() as any).reorderTask(board.id, alphaColId, 2, 0)

    // Assert — Beta column tasks are unchanged
    const betaTasks = useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns.find((c) => c.id === betaColId)!.tasks
    expect(betaTasks).toHaveLength(2)
    expect(betaTasks[0].id).toBe(beta1.id)
    expect(betaTasks[1].id).toBe(beta2.id)
  })
})
