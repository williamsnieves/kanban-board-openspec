import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react'
import { useBoardStore } from '../domain/boardStore'
import { BoardList } from '../components/BoardList'

beforeEach(() => {
  localStorage.clear()
  act(() => {
    useBoardStore.setState({ boards: [], selectedBoardId: null })
  })
})

describe('Board rename with deterministic validation', () => {
  it('Rename board with valid name', () => {
    // Arrange
    act(() => {
      useBoardStore.setState({
        boards: [{ id: 'b1', name: 'Old Name', columns: [], createdAt: new Date().toISOString() }],
        selectedBoardId: null,
      })
    })

    // Act
    act(() => {
      useBoardStore.getState().renameBoard('b1', 'New Name')
    })

    // Assert
    const boards = useBoardStore.getState().boards
    expect(boards[0].name).toBe('New Name')
  })

  it('Reject empty rename', async () => {
    // Arrange
    act(() => {
      useBoardStore.setState({
        boards: [{ id: 'b1', name: 'My Board', columns: [], createdAt: new Date().toISOString() }],
        selectedBoardId: null,
      })
    })
    render(<BoardList />)

    // Act
    fireEvent.click(screen.getByTestId('board-rename-trigger'))
    fireEvent.change(screen.getByTestId('board-rename-input'), { target: { value: '' } })
    fireEvent.click(screen.getByTestId('board-rename-submit'))

    // Assert
    expect(screen.getByTestId('board-rename-error')).toHaveTextContent('Board name cannot be empty.')
    expect(useBoardStore.getState().boards[0].name).toBe('My Board')
  })
})
