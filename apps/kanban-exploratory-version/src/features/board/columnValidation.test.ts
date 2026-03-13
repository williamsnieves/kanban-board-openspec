import { validateColumnName } from '@/features/board/columnValidation'

describe('Shared column-name validation', () => {
  it('accepts a non-empty trimmed name with no duplicates', () => {
    // Arrange
    const name = 'Review'
    const existing = ['Todo', 'Doing', 'Done']

    // Act
    const result = validateColumnName(name, existing)

    // Assert
    expect(result).toBeNull()
  })

  it('Reject empty column name on create', () => {
    // Arrange
    const name = ''
    const existing = ['Todo', 'Doing', 'Done']

    // Act
    const result = validateColumnName(name, existing)

    // Assert
    expect(result).toBe('Column name is required')
  })

  it('Reject whitespace-only column name on create', () => {
    // Arrange
    const name = '   '
    const existing = ['Todo', 'Doing', 'Done']

    // Act
    const result = validateColumnName(name, existing)

    // Assert
    expect(result).toBe('Column name is required')
  })

  it('Reject duplicate column name on create (exact case)', () => {
    // Arrange
    const name = 'Review'
    const existing = ['Todo', 'Review', 'Done']

    // Act
    const result = validateColumnName(name, existing)

    // Assert
    expect(result).toBe('Column name already exists')
  })

  it('Reject duplicate column name on create (case-insensitive)', () => {
    // Arrange
    const name = 'review'
    const existing = ['Todo', 'Review', 'Done']

    // Act
    const result = validateColumnName(name, existing)

    // Assert
    expect(result).toBe('Column name already exists')
  })

  it('Reject duplicate rename (case-insensitive — UPPERCASE variant)', () => {
    // Arrange
    const name = 'REVIEW'
    const existing = ['Todo', 'review', 'Done']

    // Act
    const result = validateColumnName(name, existing)

    // Assert
    expect(result).toBe('Column name already exists')
  })

  it('excludeName skips self on rename — same name is valid', () => {
    // Arrange — renaming "Backlog" to "Backlog" (no-op) should pass
    const name = 'Backlog'
    const existing = ['Todo', 'Backlog', 'Done']
    const excludeName = 'Backlog'

    // Act
    const result = validateColumnName(name, existing, excludeName)

    // Assert
    expect(result).toBeNull()
  })

  it('excludeName skips self on rename — different casing of same name is valid', () => {
    // Arrange — rename "Backlog" to "backlog" should be allowed (same column, case change only)
    const name = 'backlog'
    const existing = ['Todo', 'Backlog', 'Done']
    const excludeName = 'Backlog'

    // Act
    const result = validateColumnName(name, existing, excludeName)

    // Assert
    expect(result).toBeNull()
  })

  it('excludeName still blocks collision with a different sibling', () => {
    // Arrange — renaming "Backlog" to "review" collides with sibling "Review"
    const name = 'review'
    const existing = ['Backlog', 'Review', 'Done']
    const excludeName = 'Backlog'

    // Act
    const result = validateColumnName(name, existing, excludeName)

    // Assert
    expect(result).toBe('Column name already exists')
  })
})
