import { greet } from '@/features/example/greet'

describe('Minimal feature scaffold', () => {
  it('greet returns a greeting string', () => {
    // Arrange
    const name = 'World'

    // Act
    const result = greet(name)

    // Assert
    expect(result).toBe('Hello, World!')
  })
})
