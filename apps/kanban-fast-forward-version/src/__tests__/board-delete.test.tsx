import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react'
import { useBoardStore } from '../domain/boardStore'
import { BoardList } from '../components/BoardList'

const makeBoard = (id: string, name: string) => ({
  id, name, columns: [], createdAt: new Date().toISOString()
})

beforeEach(() => {
  localStorage.clear()
  act(() => {
    useBoardStore.setState({ boards: [], selectedBoardId: null })
  })
})

describe('Board delete with confirmation', () => {
  it('Confirm board deletion', async () => {
    // Arrange
    act(() => {
      useBoardStore.setState({ boards: [makeBoard('b1', 'Board One')], selectedBoardId: null })
    })
    render(<BoardList />)

    // Act
    fireEvent.click(screen.getByTestId('board-delete-trigger'))
    fireEvent.click(screen.getByTestId('board-delete-confirm'))

    // Assert
    expect(useBoardStore.getState().boards).toHaveLength(0)
    expect(screen.queryByTestId('board-delete-dialog')).not.toBeInTheDocument()
  })

  it('Cancel board deletion', async () => {
    // Arrange
    act(() => {
      useBoardStore.setState({ boards: [makeBoard('b1', 'Board One')], selectedBoardId: null })
    })
    render(<BoardList />)

    // Act
    fireEvent.click(screen.getByTestId('board-delete-trigger'))
    fireEvent.click(screen.getByTestId('board-delete-cancel'))

    // Assert
    expect(useBoardStore.getState().boards).toHaveLength(1)
    expect(screen.queryByTestId('board-delete-dialog')).not.toBeInTheDocument()
  })
})
