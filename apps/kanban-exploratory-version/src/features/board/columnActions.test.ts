import { useBoardStore } from '@/features/board/useBoardStore'

beforeEach(() => {
  localStorage.clear()
  useBoardStore.setState({ boards: [], currentBoardId: null })
})

// ─────────────────────────────────────────────────────────────────────────────
// Requirement: Create custom column
// ─────────────────────────────────────────────────────────────────────────────

describe('Create custom column', () => {
  it('Create column with valid unique name', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!

    // Act
    const error = useBoardStore.getState().createColumn(board.id, 'Review')

    // Assert
    expect(error).toBeNull()
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!
    expect(updatedBoard.columns.map((c) => c.name)).toContain('Review')
    expect(updatedBoard.columns).toHaveLength(4)
  })

  it('Persist created column in mock-backed state', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!

    // Act
    useBoardStore.getState().createColumn(board.id, 'Review')

    // Assert
    const raw = localStorage.getItem('flowboard-storage')!
    const parsed = JSON.parse(raw)
    const storedBoard = parsed.state.boards.find((b: { id: string }) => b.id === board.id)
    expect(storedBoard.columns.map((c: { name: string }) => c.name)).toContain('Review')
  })

  it('Reject empty column name on create', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!

    // Act
    const error = useBoardStore.getState().createColumn(board.id, '')

    // Assert
    expect(error).toBe('Column name is required')
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!
    expect(updatedBoard.columns).toHaveLength(3)
  })

  it('Reject whitespace-only column name on create', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!

    // Act
    const error = useBoardStore.getState().createColumn(board.id, '   ')

    // Assert
    expect(error).toBe('Column name is required')
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!
    expect(updatedBoard.columns).toHaveLength(3)
  })

  it('Reject duplicate column name on create (case-insensitive)', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!
    useBoardStore.getState().createColumn(board.id, 'Review')

    // Act
    const error = useBoardStore.getState().createColumn(board.id, 'review')

    // Assert
    expect(error).toBe('Column name already exists')
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!
    expect(updatedBoard.columns).toHaveLength(4) // no extra column added
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Requirement: Rename custom column
// ─────────────────────────────────────────────────────────────────────────────

describe('Rename custom column', () => {
  it('Rename column with valid unique name', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!
    useBoardStore.getState().createColumn(board.id, 'Backlog')
    const col = useBoardStore
      .getState()
      .boards.find((b) => b.id === board.id)!
      .columns.find((c) => c.name === 'Backlog')!

    // Act
    const error = useBoardStore.getState().renameColumn(board.id, col.id, 'Ready')

    // Assert
    expect(error).toBeNull()
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!
    expect(updatedBoard.columns.find((c) => c.id === col.id)?.name).toBe('Ready')
  })

  it('Persist renamed column in mock-backed state', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!
    useBoardStore.getState().createColumn(board.id, 'Backlog')
    const col = useBoardStore
      .getState()
      .boards.find((b) => b.id === board.id)!
      .columns.find((c) => c.name === 'Backlog')!

    // Act
    useBoardStore.getState().renameColumn(board.id, col.id, 'Ready')

    // Assert
    const raw = localStorage.getItem('flowboard-storage')!
    const parsed = JSON.parse(raw)
    const storedBoard = parsed.state.boards.find((b: { id: string }) => b.id === board.id)
    const names = storedBoard.columns.map((c: { name: string }) => c.name)
    expect(names).toContain('Ready')
    expect(names).not.toContain('Backlog')
  })

  it('Reject invalid rename with empty value', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!
    useBoardStore.getState().createColumn(board.id, 'Backlog')
    const col = useBoardStore
      .getState()
      .boards.find((b) => b.id === board.id)!
      .columns.find((c) => c.name === 'Backlog')!

    // Act
    const error = useBoardStore.getState().renameColumn(board.id, col.id, '')

    // Assert
    expect(error).toBe('Column name is required')
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!
    expect(updatedBoard.columns.find((c) => c.id === col.id)?.name).toBe('Backlog')
  })

  it('Reject invalid rename with whitespace-only value', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!
    useBoardStore.getState().createColumn(board.id, 'Backlog')
    const col = useBoardStore
      .getState()
      .boards.find((b) => b.id === board.id)!
      .columns.find((c) => c.name === 'Backlog')!

    // Act
    const error = useBoardStore.getState().renameColumn(board.id, col.id, '   ')

    // Assert
    expect(error).toBe('Column name is required')
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!
    expect(updatedBoard.columns.find((c) => c.id === col.id)?.name).toBe('Backlog')
  })

  it('Reject duplicate rename (case-insensitive)', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!
    useBoardStore.getState().createColumn(board.id, 'Backlog')
    useBoardStore.getState().createColumn(board.id, 'Review')
    const updatedBoardBefore = useBoardStore.getState().boards.find((b) => b.id === board.id)!
    const backlogCol = updatedBoardBefore.columns.find((c) => c.name === 'Backlog')!
    const reviewCol = updatedBoardBefore.columns.find((c) => c.name === 'Review')!

    // Act
    const error = useBoardStore.getState().renameColumn(board.id, backlogCol.id, 'review')

    // Assert — both original names remain unchanged
    expect(error).toBe('Column name already exists')
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!
    expect(updatedBoard.columns.find((c) => c.id === backlogCol.id)?.name).toBe('Backlog')
    expect(updatedBoard.columns.find((c) => c.id === reviewCol.id)?.name).toBe('Review')
  })

  it('Rename column to same name is valid (no-op passthrough)', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!
    useBoardStore.getState().createColumn(board.id, 'Backlog')
    const col = useBoardStore
      .getState()
      .boards.find((b) => b.id === board.id)!
      .columns.find((c) => c.name === 'Backlog')!

    // Act
    const error = useBoardStore.getState().renameColumn(board.id, col.id, 'Backlog')

    // Assert
    expect(error).toBeNull()
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!
    expect(updatedBoard.columns.find((c) => c.id === col.id)?.name).toBe('Backlog')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Requirement: Delete only empty columns
// ─────────────────────────────────────────────────────────────────────────────

describe('Delete only empty columns', () => {
  it('Delete an empty custom column', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!
    useBoardStore.getState().createColumn(board.id, 'Blocked')
    const col = useBoardStore
      .getState()
      .boards.find((b) => b.id === board.id)!
      .columns.find((c) => c.name === 'Blocked')!

    // Act
    const error = useBoardStore.getState().deleteColumn(board.id, col.id)

    // Assert
    expect(error).toBeNull()
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!
    expect(updatedBoard.columns.map((c) => c.name)).not.toContain('Blocked')
  })

  it('Persist deletion in mock-backed storage', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!
    useBoardStore.getState().createColumn(board.id, 'Blocked')
    const col = useBoardStore
      .getState()
      .boards.find((b) => b.id === board.id)!
      .columns.find((c) => c.name === 'Blocked')!

    // Act
    useBoardStore.getState().deleteColumn(board.id, col.id)

    // Assert
    const raw = localStorage.getItem('flowboard-storage')!
    const parsed = JSON.parse(raw)
    const storedBoard = parsed.state.boards.find((b: { id: string }) => b.id === board.id)
    expect(storedBoard.columns.map((c: { name: string }) => c.name)).not.toContain('Blocked')
  })

  it('Prevent deleting a non-empty custom column', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!
    useBoardStore.getState().createColumn(board.id, 'Blocked')
    const col = useBoardStore
      .getState()
      .boards.find((b) => b.id === board.id)!
      .columns.find((c) => c.name === 'Blocked')!
    useBoardStore.getState().createCard(board.id, col.id, 'Stuck task')

    // Act
    const error = useBoardStore.getState().deleteColumn(board.id, col.id)

    // Assert
    expect(error).toBe('Cannot delete a column with cards')
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!
    expect(updatedBoard.columns.map((c) => c.name)).toContain('Blocked')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Requirement: Protect default columns from deletion
// ─────────────────────────────────────────────────────────────────────────────

describe('Protect default columns from deletion', () => {
  it('Attempt to delete protected default column "Todo"', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!
    const todoCol = useBoardStore
      .getState()
      .boards.find((b) => b.id === board.id)!
      .columns.find((c) => c.name === 'Todo')!

    // Act
    const error = useBoardStore.getState().deleteColumn(board.id, todoCol.id)

    // Assert
    expect(error).toBe('Cannot delete a default column')
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!
    expect(updatedBoard.columns.map((c) => c.name)).toContain('Todo')
  })

  it('Attempt to delete protected default column "Doing"', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!
    const doingCol = useBoardStore
      .getState()
      .boards.find((b) => b.id === board.id)!
      .columns.find((c) => c.name === 'Doing')!

    // Act
    const error = useBoardStore.getState().deleteColumn(board.id, doingCol.id)

    // Assert
    expect(error).toBe('Cannot delete a default column')
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!
    expect(updatedBoard.columns.map((c) => c.name)).toContain('Doing')
  })

  it('Attempt to delete protected default column "Done"', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!
    const doneCol = useBoardStore
      .getState()
      .boards.find((b) => b.id === board.id)!
      .columns.find((c) => c.name === 'Done')!

    // Act
    const error = useBoardStore.getState().deleteColumn(board.id, doneCol.id)

    // Assert
    expect(error).toBe('Cannot delete a default column')
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!
    expect(updatedBoard.columns.map((c) => c.name)).toContain('Done')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Case-insensitive uniqueness (cross-cutting)
// ─────────────────────────────────────────────────────────────────────────────

describe('Case-insensitive uniqueness behavior', () => {
  it('create rejects UPPERCASE variant of existing lowercase name', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!
    useBoardStore.getState().createColumn(board.id, 'review')

    // Act
    const error = useBoardStore.getState().createColumn(board.id, 'REVIEW')

    // Assert
    expect(error).toBe('Column name already exists')
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!
    const reviewCount = updatedBoard.columns.filter(
      (c) => c.name.toLowerCase() === 'review'
    ).length
    expect(reviewCount).toBe(1)
  })

  it('rename rejects mixed-case variant of sibling column name', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!
    useBoardStore.getState().createColumn(board.id, 'Alpha')
    useBoardStore.getState().createColumn(board.id, 'Beta')
    const boardAfter = useBoardStore.getState().boards.find((b) => b.id === board.id)!
    const alphaCol = boardAfter.columns.find((c) => c.name === 'Alpha')!
    const betaCol = boardAfter.columns.find((c) => c.name === 'Beta')!

    // Act
    const error = useBoardStore.getState().renameColumn(board.id, alphaCol.id, 'BETA')

    // Assert
    expect(error).toBe('Column name already exists')
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!
    expect(updatedBoard.columns.find((c) => c.id === alphaCol.id)?.name).toBe('Alpha')
    expect(updatedBoard.columns.find((c) => c.id === betaCol.id)?.name).toBe('Beta')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Mock rehydration consistency
// ─────────────────────────────────────────────────────────────────────────────

describe('Reorder excluded from this change', () => {
  it('Scope validation for column management MVP — mock rehydration consistency', () => {
    // Arrange — perform create, rename, delete operations
    const board = useBoardStore.getState().createBoard('Rehydration Board')!
    useBoardStore.getState().createColumn(board.id, 'Staging')
    const stagingCol = useBoardStore
      .getState()
      .boards.find((b) => b.id === board.id)!
      .columns.find((c) => c.name === 'Staging')!
    useBoardStore.getState().renameColumn(board.id, stagingCol.id, 'QA')
    useBoardStore.getState().createColumn(board.id, 'Archive')
    const archiveCol = useBoardStore
      .getState()
      .boards.find((b) => b.id === board.id)!
      .columns.find((c) => c.name === 'Archive')!
    useBoardStore.getState().deleteColumn(board.id, archiveCol.id)

    // Act — read from localStorage to simulate rehydration
    const raw = localStorage.getItem('flowboard-storage')!
    const parsed = JSON.parse(raw)
    const storedBoard = parsed.state.boards.find((b: { id: string }) => b.id === board.id)

    // Assert — persisted state matches in-memory state
    const inMemoryNames = useBoardStore
      .getState()
      .boards.find((b) => b.id === board.id)!
      .columns.map((c) => c.name)
    const storedNames = storedBoard.columns.map((c: { name: string }) => c.name)
    expect(storedNames).toEqual(inMemoryNames)
    expect(storedNames).toContain('QA')
    expect(storedNames).not.toContain('Staging')
    expect(storedNames).not.toContain('Archive')
  })
})
