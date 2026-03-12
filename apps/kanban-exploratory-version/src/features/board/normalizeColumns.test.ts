import { normalizeColumns } from '@/features/board/normalizeColumns'
import type { Column } from '@/features/board/types'

const col = (name: string, tasks: Column['tasks'] = []): Column => ({ id: name.toLowerCase(), name, tasks })

describe('Board view default columns', () => {
  it('shows Todo, Doing, Done for an empty board', () => {
    // Arrange
    const input: Column[] = []
    // Act
    const result = normalizeColumns(input)
    // Assert
    expect(result.map(c => c.name)).toEqual(['Todo', 'Doing', 'Done'])
  })
})

describe('Idempotent UI initialization', () => {
  it('does not duplicate columns on repeated initialization', () => {
    // Arrange
    const input: Column[] = []
    // Act
    const once = normalizeColumns(input)
    const twice = normalizeColumns(once)
    // Assert
    expect(twice).toHaveLength(3)
    expect(twice.map(c => c.name)).toEqual(['Todo', 'Doing', 'Done'])
  })
})

describe('Complete missing defaults and preserve extras', () => {
  it('adds missing defaults and preserves extra columns', () => {
    // Arrange
    const input = [col('Todo'), col('Blocked')]
    // Act
    const result = normalizeColumns(input)
    // Assert
    expect(result.map(c => c.name)).toEqual(['Todo', 'Doing', 'Done', 'Blocked'])
  })
})

describe('Case-normalized default matching', () => {
  it('normalizes mixed-case defaults to canonical labels', () => {
    // Arrange
    const input = [col('todo'), col('DOING'), col('Done')]
    // Act
    const result = normalizeColumns(input)
    // Assert
    expect(result.map(c => c.name)).toEqual(['Todo', 'Doing', 'Done'])
  })

  it('collapses duplicate default variants to one canonical column', () => {
    // Arrange
    const input = [col('todo'), col('Todo')]
    // Act
    const result = normalizeColumns(input)
    // Assert
    const todoColumns = result.filter(c => c.name === 'Todo')
    expect(todoColumns).toHaveLength(1)
  })
})

describe('Empty columns are valid', () => {
  it('returns all three defaults with empty task lists', () => {
    // Arrange
    const input: Column[] = []
    // Act
    const result = normalizeColumns(input)
    // Assert
    expect(result.every(c => c.tasks.length === 0)).toBe(true)
  })
})
