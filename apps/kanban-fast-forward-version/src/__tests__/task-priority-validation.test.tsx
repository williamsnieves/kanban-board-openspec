import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { act } from 'react'
import { useBoardStore } from '../domain/boardStore'
import { BoardView } from '../components/BoardView'

const makeBoard = () => ({
  id: 'b1', name: 'B', createdAt: new Date().toISOString(),
  columns: [{ id: 'c1', name: 'Todo', position: 0, boardId: 'b1', tasks: [] }]
})

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  localStorage.clear()
  act(() => { useBoardStore.setState({ boards: [makeBoard()], selectedBoardId: 'b1' }) })
})

describe('Task priority catalog', () => {
  it('Reject invalid priority value', async () => {
    // Arrange
    render(<BoardView />)
    const titleInput = screen.getByTestId('add-task-input')
    const prioritySelect = screen.getByTestId('task-priority-select')

    // Act — set invalid priority via fireEvent then submit
    fireEvent.change(titleInput, { target: { value: 'Test Task' } })
    fireEvent.change(prioritySelect, { target: { value: 'critical' } })
    fireEvent.click(screen.getByTestId('add-task-btn'))

    // Assert
    expect(screen.getByTestId('task-priority-error')).toBeInTheDocument()
    expect(useBoardStore.getState().boards[0].columns[0].tasks).toHaveLength(0)
  })
})

describe('Due date validation behavior', () => {
  it('Reject invalid date format', async () => {
    // Arrange
    render(<BoardView />)
    const titleInput = screen.getByTestId('add-task-input')
    const dueDateInput = screen.getByTestId('task-due-date-input')

    // Act
    fireEvent.change(titleInput, { target: { value: 'Test Task' } })
    fireEvent.change(dueDateInput, { target: { value: 'not-a-date' } })
    fireEvent.click(screen.getByTestId('add-task-btn'))

    // Assert
    expect(screen.getByTestId('task-due-date-error')).toBeInTheDocument()
    expect(screen.getByTestId('task-due-date-error')).toHaveTextContent('Due date must be a valid date (YYYY-MM-DD).')
    expect(useBoardStore.getState().boards[0].columns[0].tasks).toHaveLength(0)
  })
})
