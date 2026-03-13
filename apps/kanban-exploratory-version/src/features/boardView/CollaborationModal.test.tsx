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

function getTask(boardId: string, colId: string, taskId: string) {
  return useBoardStore.getState().boards.find(b => b.id === boardId)!
    .columns.find(c => c.id === colId)!.tasks.find(t => t.id === taskId)! as Task
}

function renderModal(boardId: string, colId: string, task: Task) {
  render(<CardDetailModal boardId={boardId} columnId={colId} task={task} onClose={() => {}} onDelete={() => {}} />)
}

describe('CardDetailModal — collaboration tabs', () => {
  it('Renders three tabs: Details, Checklist, Activity', () => {
    // Arrange / Act
    const { boardId, colId, task } = setup()
    renderModal(boardId, colId, task)
    // Assert
    expect(screen.getByTestId('tab-details')).toBeInTheDocument()
    expect(screen.getByTestId('tab-checklist')).toBeInTheDocument()
    expect(screen.getByTestId('tab-activity')).toBeInTheDocument()
  })

  it('Checklist tab: add subtask via input and button', () => {
    // Arrange
    const { boardId, colId, task } = setup()
    renderModal(boardId, colId, task)
    // Act
    fireEvent.click(screen.getByTestId('tab-checklist'))
    fireEvent.change(screen.getByTestId('subtask-input'), { target: { value: 'Research API' } })
    fireEvent.click(screen.getByTestId('subtask-add-btn'))
    // Assert
    const updated = getTask(boardId, colId, task.id)
    expect(updated.subtasks).toHaveLength(1)
    expect(updated.subtasks[0].text).toBe('Research API')
  })

  it('Checklist tab: toggle subtask checkbox updates isCompleted', () => {
    // Arrange
    const { boardId, colId, task } = setup()
    useBoardStore.getState().addSubtask(boardId, colId, task.id, 'Step 1')
    const updatedTask = getTask(boardId, colId, task.id)
    renderModal(boardId, colId, updatedTask)
    // Act
    fireEvent.click(screen.getByTestId('tab-checklist'))
    const subtask = updatedTask.subtasks[0]
    fireEvent.click(screen.getByTestId(`subtask-toggle-${subtask.id}`))
    // Assert
    expect(getTask(boardId, colId, task.id).subtasks[0].isCompleted).toBe(true)
  })

  it('Checklist tab: delete subtask removes it from store', () => {
    // Arrange
    const { boardId, colId, task } = setup()
    useBoardStore.getState().addSubtask(boardId, colId, task.id, 'To delete')
    const updatedTask = getTask(boardId, colId, task.id)
    renderModal(boardId, colId, updatedTask)
    // Act
    fireEvent.click(screen.getByTestId('tab-checklist'))
    const subtask = updatedTask.subtasks[0]
    fireEvent.click(screen.getByTestId(`subtask-delete-${subtask.id}`))
    // Assert
    expect(getTask(boardId, colId, task.id).subtasks).toHaveLength(0)
  })

  it('Checklist tab: progress indicator is rendered', () => {
    // Arrange
    const { boardId, colId, task } = setup()
    useBoardStore.getState().addSubtask(boardId, colId, task.id, 'Step 1')
    const updatedTask = getTask(boardId, colId, task.id)
    renderModal(boardId, colId, updatedTask)
    // Act
    fireEvent.click(screen.getByTestId('tab-checklist'))
    // Assert
    expect(screen.getByTestId('subtask-progress')).toBeInTheDocument()
  })

  it('Activity tab: add comment via input and submit button', () => {
    // Arrange
    const { boardId, colId, task } = setup()
    renderModal(boardId, colId, task)
    // Act
    fireEvent.click(screen.getByTestId('tab-activity'))
    fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'This needs review' } })
    fireEvent.click(screen.getByTestId('comment-submit-btn'))
    // Assert
    const updated = getTask(boardId, colId, task.id)
    expect(updated.comments).toHaveLength(1)
    expect(updated.comments[0].text).toBe('This needs review')
  })

  it('Activity tab: delete comment removes it from store', () => {
    // Arrange
    const { boardId, colId, task } = setup()
    useBoardStore.getState().addComment(boardId, colId, task.id, 'Delete me')
    const updatedTask = getTask(boardId, colId, task.id)
    renderModal(boardId, colId, updatedTask)
    // Act
    fireEvent.click(screen.getByTestId('tab-activity'))
    const comment = updatedTask.comments[0]
    fireEvent.click(screen.getByTestId(`comment-delete-${comment.id}`))
    // Assert
    expect(getTask(boardId, colId, task.id).comments).toHaveLength(0)
  })
})
