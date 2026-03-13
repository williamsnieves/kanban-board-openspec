import { localStorageAdapter } from '@/features/persistence/localStorageAdapter'

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('LocalStorageAdapter', () => {
  it('save: serializes and writes value to localStorage under the given key', () => {
    // Arrange
    const data = { boards: [{ id: '1', name: 'Board' }] }
    // Act
    localStorageAdapter.save('test-key', data)
    // Assert
    const raw = localStorage.getItem('test-key')
    expect(raw).not.toBeNull()
    expect(JSON.parse(raw!)).toEqual(data)
  })

  it('load: reads and deserializes value from localStorage', () => {
    // Arrange
    const data = { boards: [{ id: '1', name: 'Board' }] }
    localStorage.setItem('test-key', JSON.stringify(data))
    // Act
    const result = localStorageAdapter.load('test-key')
    // Assert
    expect(result).toEqual(data)
  })

  it('load: returns null when key does not exist', () => {
    // Arrange — localStorage is empty
    // Act
    const result = localStorageAdapter.load('nonexistent-key')
    // Assert
    expect(result).toBeNull()
  })

  it('load: returns null and does not throw when value is invalid JSON', () => {
    // Arrange
    localStorage.setItem('bad-key', 'not-valid-json{{{')
    // Act / Assert — must not throw
    expect(() => localStorageAdapter.load('bad-key')).not.toThrow()
    expect(localStorageAdapter.load('bad-key')).toBeNull()
  })

  it('clear: removes the item from localStorage', () => {
    // Arrange
    localStorage.setItem('clear-key', '"value"')
    // Act
    localStorageAdapter.clear('clear-key')
    // Assert
    expect(localStorage.getItem('clear-key')).toBeNull()
  })

  it('save: catches QuotaExceededError and does not throw', () => {
    // Arrange — mock setItem to throw QuotaExceededError
    const error = new DOMException('QuotaExceeded', 'QuotaExceededError')
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw error })
    // Act / Assert — must not throw
    expect(() => localStorageAdapter.save('key', { big: 'data' })).not.toThrow()
  })

  it('save: catches generic errors and does not throw', () => {
    // Arrange
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('disk error') })
    // Act / Assert
    expect(() => localStorageAdapter.save('key', {})).not.toThrow()
  })
})
