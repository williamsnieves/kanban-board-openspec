import { render, screen, cleanup } from '@testing-library/react'
import { act } from 'react'
import { useBoardStore } from '../domain/boardStore'
import { BoardView } from '../components/BoardView'

const makeTask = (overrides = {}) => ({
  id: 't1', title: 'Test Task', position: 0, columnId: 'c1',
  priority: 'high' as const,
  ...overrides,
})

const makeBoard = (tasks: ReturnType<typeof makeTask>[] = []) => ({
  id: 'b1', name: 'B', createdAt: new Date().toISOString(),
  columns: [{ id: 'c1', name: 'Todo', position: 0, boardId: 'b1', tasks }]
})

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  localStorage.clear()
  act(() => { useBoardStore.setState({ boards: [], selectedBoardId: null }) })
})

describe('Task card metadata display', () => {
  it('Render priority and due date in card — priority badge always visible', () => {
    // Arrange
    act(() => {
      useBoardStore.setState({ boards: [makeBoard([makeTask()])], selectedBoardId: 'b1' })
    })

    // Act
    render(<BoardView />)

    // Assert
    expect(screen.getByTestId('task-priority-badge')).toBeInTheDocument()
    expect(screen.queryByTestId('task-due-date-display')).not.toBeInTheDocument()
  })

  it('Render priority and due date in card — due date display shown when set', () => {
    // Arrange
    act(() => {
      useBoardStore.setState({
        boards: [makeBoard([makeTask({ dueDate: '2026-06-15' })])],
        selectedBoardId: 'b1'
      })
    })

    // Act
    render(<BoardView />)

    // Assert
    expect(screen.getByTestId('task-priority-badge')).toBeInTheDocument()
    expect(screen.getByTestId('task-due-date-display')).toBeInTheDocument()
  })
})
