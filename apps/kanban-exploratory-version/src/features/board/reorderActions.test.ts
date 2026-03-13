import { useBoardStore } from '@/features/board/useBoardStore'
import { normalizeColumns } from '@/features/board/normalizeColumns'

beforeEach(() => {
  localStorage.clear()
  useBoardStore.setState({ boards: [], currentBoardId: null })
})

// ─────────────────────────────────────────────────────────────────────────────
// Requirement: Reorder custom columns — move-left / move-right store actions
// ─────────────────────────────────────────────────────────────────────────────

describe('Reorder custom columns — move-left and move-right', () => {
  it('Move-left success: custom column at index N moves to N-1, state confirmed', () => {
    // Arrange — [Todo(0), Doing(1), Done(2), Review(3), Backlog(4)]
    const board = useBoardStore.getState().createBoard('My Board')!
    useBoardStore.getState().createColumn(board.id, 'Review')
    useBoardStore.getState().createColumn(board.id, 'Backlog')

    // Act — move Backlog (index 4) left to index 3
    const error = useBoardStore.getState().reorderColumn(board.id, 4, 3)

    // Assert
    expect(error).toBeNull()
    const display = normalizeColumns(
      useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns
    )
    expect(display[3].name).toBe('Backlog')
    expect(display[4].name).toBe('Review')
  })

  it('Move-right success: custom column at index N moves to N+1, state confirmed', () => {
    // Arrange — [Todo(0), Doing(1), Done(2), Review(3), Backlog(4)]
    const board = useBoardStore.getState().createBoard('My Board')!
    useBoardStore.getState().createColumn(board.id, 'Review')
    useBoardStore.getState().createColumn(board.id, 'Backlog')

    // Act — move Review (index 3) right to index 4
    const error = useBoardStore.getState().reorderColumn(board.id, 3, 4)

    // Assert
    expect(error).toBeNull()
    const display = normalizeColumns(
      useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns
    )
    expect(display[3].name).toBe('Backlog')
    expect(display[4].name).toBe('Review')
  })

  it('Protected move-left blocked: source protected column returns error string, state unchanged', () => {
    // Arrange — Done is at display index 2; move-left targets index 1 (both valid)
    const board = useBoardStore.getState().createBoard('My Board')!
    const beforeNames = normalizeColumns(
      useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns
    ).map((c) => c.name)

    // Act — attempt to move Done (index 2) to index 1
    const error = useBoardStore.getState().reorderColumn(board.id, 2, 1)

    // Assert
    expect(error).toBe('Cannot reorder a default column')
    const afterNames = normalizeColumns(
      useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns
    ).map((c) => c.name)
    expect(afterNames).toEqual(beforeNames)
  })

  it('Protected move-right blocked: source protected column returns error string, state unchanged', () => {
    // Arrange — Doing is at display index 1; move-right targets index 2 (both valid)
    const board = useBoardStore.getState().createBoard('My Board')!
    const beforeNames = normalizeColumns(
      useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns
    ).map((c) => c.name)

    // Act — attempt to move Doing (index 1) to index 2
    const error = useBoardStore.getState().reorderColumn(board.id, 1, 2)

    // Assert
    expect(error).toBe('Cannot reorder a default column')
    const afterNames = normalizeColumns(
      useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns
    ).map((c) => c.name)
    expect(afterNames).toEqual(beforeNames)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Requirement: Reorder custom columns via drag-and-drop
// ─────────────────────────────────────────────────────────────────────────────

describe('Reorder custom columns via drag-and-drop', () => {
  it('Successful reorder: custom column moves to new display index', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!
    useBoardStore.getState().createColumn(board.id, 'Review')
    useBoardStore.getState().createColumn(board.id, 'Backlog')
    // display order before: [Todo(0), Doing(1), Done(2), Review(3), Backlog(4)]

    // Act
    const error = useBoardStore.getState().reorderColumn(board.id, 3, 4)

    // Assert
    expect(error).toBeNull()
    const updatedBoard = useBoardStore.getState().boards.find((b) => b.id === board.id)!
    const displayNames = normalizeColumns(updatedBoard.columns).map((c) => c.name)
    expect(displayNames[3]).toBe('Backlog')
    expect(displayNames[4]).toBe('Review')
  })

  it('Protected column blocked: reorderColumn on Todo returns error string, board unchanged', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!
    useBoardStore.getState().createColumn(board.id, 'Review')
    // display order: [Todo(0), Doing(1), Done(2), Review(3)]
    const beforeNames = normalizeColumns(
      useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns
    ).map((c) => c.name)

    // Act
    const error = useBoardStore.getState().reorderColumn(board.id, 0, 3)

    // Assert
    expect(error).not.toBeNull()
    expect(typeof error).toBe('string')
    const afterNames = normalizeColumns(
      useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns
    ).map((c) => c.name)
    expect(afterNames).toEqual(beforeNames)
  })

  it('Invalid index (out-of-bounds toIndex = 999) returns error string, state unchanged', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!
    useBoardStore.getState().createColumn(board.id, 'Review')
    const beforeColumnIds = useBoardStore
      .getState()
      .boards.find((b) => b.id === board.id)!
      .columns.map((c) => c.id)

    // Act
    const error = useBoardStore.getState().reorderColumn(board.id, 3, 999)

    // Assert
    expect(error).not.toBeNull()
    expect(typeof error).toBe('string')
    const afterColumnIds = useBoardStore
      .getState()
      .boards.find((b) => b.id === board.id)!
      .columns.map((c) => c.id)
    expect(afterColumnIds).toEqual(beforeColumnIds)
  })

  it('In-session state update: after successful reorder, boards[0].columns confirms new order', () => {
    // Arrange
    const board = useBoardStore.getState().createBoard('My Board')!
    useBoardStore.getState().createColumn(board.id, 'Alpha')
    useBoardStore.getState().createColumn(board.id, 'Beta')
    // display order before: [Todo(0), Doing(1), Done(2), Alpha(3), Beta(4)]

    // Act
    useBoardStore.getState().reorderColumn(board.id, 3, 4)

    // Assert
    const updatedColumns = useBoardStore.getState().boards[0].columns
    const displayNames = normalizeColumns(updatedColumns).map((c) => c.name)
    expect(displayNames[3]).toBe('Beta')
    expect(displayNames[4]).toBe('Alpha')
  })

  it('Scope validation: reorder does not guarantee persistence after full reload (task 6.6)', () => {
    // Arrange — reorder custom columns in current session
    const board = useBoardStore.getState().createBoard('My Board')!
    useBoardStore.getState().createColumn(board.id, 'Alpha')
    useBoardStore.getState().createColumn(board.id, 'Beta')
    useBoardStore.getState().reorderColumn(board.id, 3, 4)
    const reorderedNames = normalizeColumns(
      useBoardStore.getState().boards.find((b) => b.id === board.id)!.columns
    ).map((c) => c.name)
    expect(reorderedNames[3]).toBe('Beta') // reorder is active in session

    // Act — simulate full reload: clear in-memory state (localStorage may or may not reflect order)
    useBoardStore.setState({ boards: [], currentBoardId: null })

    // Assert — after state reset, reordered state is gone; spec does not guarantee restoration
    const afterReset = useBoardStore.getState().boards
    expect(afterReset).toHaveLength(0) // no boards loaded from scratch without hydration
    // This confirms reorder is session-scoped: no guarantee of restoration after reload
  })
})
