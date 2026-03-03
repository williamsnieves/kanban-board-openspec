# Tasks: Board Card Collaboration Features

## Implementation Tasks

- [ ] **Update Task Interface**
    - Add `comments: Comment[]`
    - Add `subtasks: Subtask[]`
    - Add `activityLog: ActivityLog[]`
    - Update mock data generator to include empty arrays for these fields.

- [ ] **Update Store Logic**
    - Add `addComment(taskId, text)` action.
    - Add `deleteComment(taskId, commentId)` action.
    - Add `addSubtask(taskId, text)` action.
    - Add `toggleSubtask(taskId, subtaskId)` action.
    - Add `deleteSubtask(taskId, subtaskId)` action.
    - Update `moveCard` and `updateTask` to append to `activityLog` (e.g., "Moved from X to Y").

- [ ] **Update Card Detail Modal**
    - Add **Checklist Tab**:
        - Render subtask list with checkboxes.
        - Add input for new subtasks.
        - Show progress bar.
    - Add **Activity Tab**:
        - Render combined list of comments and activity log.
        - Add comment input.
    - Ensure tabs are navigable and state is preserved.

- [ ] **Update Card Component**
    - Add **Subtask Badge**: Checkbox icon with "X/Y" count.
    - Add **Comment Badge**: Chat bubble icon with count.
    - Show badges only if items exist.

## Verification Tasks

- [ ] **Verify Comments**
    - Add comment -> Appears in activity stream.
    - Delete comment -> Removed from stream.
    - Check card badge -> Shows correct count.

- [ ] **Verify Subtasks**
    - Add subtask -> Appears in checklist.
    - Toggle subtask -> Updates progress bar and card badge.
    - Delete subtask -> Removed from list.

- [ ] **Verify Activity Log**
    - Move card -> Log entry added ("Moved to Done").
    - Change priority -> Log entry added ("Changed priority to High").
    - Verify timestamp and author ("You").

- [ ] **Verify Persistence**
    - Reload page -> Comments, subtasks, and logs are preserved.
