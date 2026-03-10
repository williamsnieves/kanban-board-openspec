import { render, screen } from '@testing-library/react'
import App from '../App'

describe('React TypeScript Vite scaffold baseline', () => {
  it('initial test execution works: baseline passing test confirms pipeline', () => {
    // Arrange
    // No props needed; App renders standalone

    // Act
    render(<App />)

    // Assert
    expect(screen.getByTestId('board-name-input')).toBeInTheDocument()
    expect(screen.getByTestId('create-board-btn')).toBeInTheDocument()
    expect(screen.getByTestId('board-list')).toBeInTheDocument()
  })
})
