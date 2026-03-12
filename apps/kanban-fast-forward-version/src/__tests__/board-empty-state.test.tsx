import { render, screen } from '@testing-library/react'
import { act } from 'react'
import { useBoardStore } from '../domain/boardStore'
import App from '../App'
import { BoardView } from '../components/BoardView'

const makeBoardWithColumns = () => ({
  id: 'b1',
  name: 'Empty Board',
  columns: [
    { id: 'c1', name: 'Todo', position: 0, boardId: 'b1', tasks: [] },
    { id: 'c2', name: 'Doing', position: 1, boardId: 'b1', tasks: [] },
  ],
  createdAt: new Date().toISOString(),
})

beforeEach(() => {
  localStorage.clear()
  act(() => {
    useBoardStore.setState({ boards: [], selectedBoardId: null })
  })
})

describe('Empty-state UX for zero boards', () => {
  it('No boards available', () => {
    // Arrange
    act(() => {
      useBoardStore.setState({ boards: [], selectedBoardId: null })
    })

    // Act
    render(<App />)

    // Assert
    expect(screen.getByTestId('empty-state-no-boards')).toBeInTheDocument()
    expect(screen.getByTestId('empty-state-create-board-cta')).toBeInTheDocument()
  })
})

describe('Empty-state UX for empty board', () => {
  it('Board with no tasks', () => {
    // Arrange
    const board = makeBoardWithColumns()
    act(() => {
      useBoardStore.setState({ boards: [board], selectedBoardId: 'b1' })
    })

    // Act
    render(<BoardView />)

    // Assert
    expect(screen.getByTestId('empty-state-no-tasks')).toBeInTheDocument()
    expect(screen.getByTestId('empty-state-create-task-cta')).toBeInTheDocument()
  })
})
