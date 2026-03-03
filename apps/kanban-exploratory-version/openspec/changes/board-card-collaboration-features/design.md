# Design: Board Card Collaboration Features

## Architecture

### Data Model Updates
- **Task Interface**:
    ```typescript
    interface Comment {
      id: string;
      text: string;
      createdAt: string; // ISO date
      author: string; // 'You' for MVP
    }

    interface Subtask {
      id: string;
      text: string;
      isCompleted: boolean;
    }

    interface ActivityLog {
      id: string;
      action: 'comment' | 'move' | 'priority' | 'create' | 'update';
      details: string; // e.g., "Moved from Todo to Done"
      timestamp: string; // ISO date
      author: string; // 'System' or 'You'
    }

    interface Task {
      // ... existing fields
      comments: Comment[];
      subtasks: Subtask[];
      activityLog: ActivityLog[];
    }
    ```

### Component Structure
- **CardDetailModal**: Update to include:
    - **Tabs**: "Details" (existing metadata), "Checklist", "Activity".
    - **Checklist Tab**:
        - List of subtasks with checkboxes.
        - Input to add new subtask.
        - Progress bar (e.g., green fill based on % completed).
    - **Activity Tab**:
        - List of comments and log entries mixed chronologically.
        - Comment input area at the bottom.
- **Card**: Update indicators:
    - `SubtaskBadge`: Checkbox icon + "X/Y".
    - `CommentBadge`: Chat bubble icon + count.

### Store Logic
- **Actions**:
    - `addComment(taskId, text)`: Creates comment, adds to `comments` array, adds to `activityLog`.
    - `deleteComment(taskId, commentId)`: Removes comment.
    - `addSubtask(taskId, text)`: Adds subtask.
    - `toggleSubtask(taskId, subtaskId)`: Toggles completion status.
    - `deleteSubtask(taskId, subtaskId)`: Removes subtask.
- **Middleware/Hook**: Ideally, implement a hook or middleware that listens to store changes (like `moveCard`, `updateTask`) and automatically appends an entry to `activityLog`. For MVP simplicity, we can just update the `activityLog` directly in the existing actions (e.g., `moveCard` action also pushes to `activityLog`).

## UX/UI Decisions
- **Activity Stream**: Combine comments and system logs into a single feed for context.
- **Subtasks**: Simple list with strikethrough for completed items.
- **Progress**: Show on card face only if subtasks exist.

## Constraints & Trade-offs
- **Log Size**: Activity log could grow indefinitely. MVP: no limit, maybe cap at last 50 entries later.
- **Author**: Hardcoded to "You" since there's no auth.
