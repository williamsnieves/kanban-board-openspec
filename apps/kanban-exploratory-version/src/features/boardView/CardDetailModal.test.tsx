import { render, screen, fireEvent } from '@testing-library/react'
import { CardDetailModal } from '@/features/boardView/CardDetailModal'
import { useBoardStore } from '@/features/board/useBoardStore'
import type { Task } from '@/features/board/types'

beforeEach(() => {
  localStorage.clear()
  useBoardStore.setState({ boards: [], currentBoardId: null })
})

function setup() {
  const board = useBoardStore.getState().createBoard('Board')!
  const colId = board.columns.find(c => c.name === 'Todo')!.id
  const task = useBoardStore.getState().createCard(board.id, colId, 'Test Task')! as Task
  return { boardId: board.id, colId, task }
}

describe('CardDetailModal — metadata editing', () => {
  it('Renders modal with task title visible', () => {
    // Arrange
    const { boardId, colId, task } = setup()
    // Act
    render(<CardDetailModal boardId={boardId} columnId={colId} task={task} onClose={() => {}} onDelete={() => {}} />)
    // Assert
    expect(screen.getByTestId('card-detail-modal')).toBeInTheDocument()
    expect(screen.getByTestId('card-detail-title')).toHaveValue('Test Task')
  })

  it('Description textarea updates task on blur', () => {
    // Arrange
    const { boardId, colId, task } = setup()
    render(<CardDetailModal boardId={boardId} columnId={colId} task={task} onClose={() => {}} onDelete={() => {}} />)
    // Act
    const textarea = screen.getByTestId('card-detail-description')
    fireEvent.change(textarea, { target: { value: 'New description' } })
    fireEvent.blur(textarea)
    // Assert
    const updated = useBoardStore.getState().boards.find(b => b.id === boardId)!.columns.find(c => c.id === colId)!.tasks.find(t => t.id === task.id)!
    expect(updated.description).toBe('New description')
  })

  it('Label toggle: clicking bug label adds it to task labels', () => {
    // Arrange
    const { boardId, colId, task } = setup()
    render(<CardDetailModal boardId={boardId} columnId={colId} task={task} onClose={() => {}} onDelete={() => {}} />)
    // Act
    fireEvent.click(screen.getByTestId('card-label-bug'))
    // Assert
    const updated = useBoardStore.getState().boards.find(b => b.id === boardId)!.columns.find(c => c.id === colId)!.tasks.find(t => t.id === task.id)!
    expect(updated.labels).toContain('bug')
  })

  it('Label toggle: clicking active bug label removes it', () => {
    // Arrange
    const { boardId, colId, task } = setup()
    useBoardStore.getState().updateTask(boardId, colId, task.id, { labels: ['bug'] })
    const updatedTask = useBoardStore.getState().boards.find(b => b.id === boardId)!.columns.find(c => c.id === colId)!.tasks.find(t => t.id === task.id)! as Task
    render(<CardDetailModal boardId={boardId} columnId={colId} task={updatedTask} onClose={() => {}} onDelete={() => {}} />)
    // Act
    fireEvent.click(screen.getByTestId('card-label-bug'))
    // Assert
    const final = useBoardStore.getState().boards.find(b => b.id === boardId)!.columns.find(c => c.id === colId)!.tasks.find(t => t.id === task.id)!
    expect(final.labels).not.toContain('bug')
  })

  it('Due date input: changing date updates task dueDate', () => {
    // Arrange
    const { boardId, colId, task } = setup()
    render(<CardDetailModal boardId={boardId} columnId={colId} task={task} onClose={() => {}} onDelete={() => {}} />)
    // Act
    fireEvent.change(screen.getByTestId('card-detail-due-date'), { target: { value: '2024-12-31' } })
    // Assert
    const updated = useBoardStore.getState().boards.find(b => b.id === boardId)!.columns.find(c => c.id === colId)!.tasks.find(t => t.id === task.id)!
    expect(updated.dueDate).toBe('2024-12-31')
  })

  it('Priority select: changing to high updates task priority', () => {
    // Arrange
    const { boardId, colId, task } = setup()
    render(<CardDetailModal boardId={boardId} columnId={colId} task={task} onClose={() => {}} onDelete={() => {}} />)
    // Act
    fireEvent.change(screen.getByTestId('card-detail-priority'), { target: { value: 'high' } })
    // Assert
    const updated = useBoardStore.getState().boards.find(b => b.id === boardId)!.columns.find(c => c.id === colId)!.tasks.find(t => t.id === task.id)!
    expect(updated.priority).toBe('high')
  })

  it('Close button calls onClose', () => {
    // Arrange
    const { boardId, colId, task } = setup()
    const onClose = vi.fn()
    render(<CardDetailModal boardId={boardId} columnId={colId} task={task} onClose={onClose} onDelete={() => {}} />)
    // Act
    fireEvent.click(screen.getByTestId('card-detail-close'))
    // Assert
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('Delete button calls onDelete', () => {
    // Arrange
    const { boardId, colId, task } = setup()
    const onDelete = vi.fn()
    render(<CardDetailModal boardId={boardId} columnId={colId} task={task} onClose={() => {}} onDelete={onDelete} />)
    // Act
    fireEvent.click(screen.getByTestId('card-detail-delete'))
    // Assert
    expect(onDelete).toHaveBeenCalledTimes(1)
  })
})
