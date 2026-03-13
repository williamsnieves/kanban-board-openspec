# Change: Board Card Collaboration Features

## Why
Even in a single-user or local-first context, users often need to track the history of a task, break it down into smaller steps, or leave notes for their future selves. Adding comments, subtasks, and an activity log simulates a collaborative environment and significantly enhances the utility of the Kanban board for complex workflows. This prepares the application for future multi-user features while providing immediate value.

## What Changes
- **Data Model**: Extend `Task` to include:
    - `comments`: Array of comment objects (id, text, createdAt, author).
    - `subtasks`: Array of checklist items (id, text, isCompleted).
    - `activityLog`: Array of activity entries (id, action, timestamp, details).
- **UI**:
    - Update **Card Detail Modal** to include tabs or sections for:
        - **Checklist**: Add/remove/toggle subtasks. Progress bar.
        - **Activity**: Stream of comments and system events (log).
        - **Comment Input**: Text area to add new notes.
    - Update **Card Component** to show indicators:
        - Subtask progress (e.g., "2/5").
        - Comment count.
- **Logic**:
    - Automatically generate activity log entries when key fields change (e.g., status change, priority update).
    - Handle subtask toggle logic.
- **Out of Scope**:
    - Real-time WebSocket updates.
    - User mentions/notifications.
    - File attachments.

## Impact
- **Data Size**: Task objects will grow larger; ensure persistence handles this efficiently.
- **UX**: The detail modal becomes the central hub for task management.
- **Code Structure**: Need to decouple "activity logging" from state updates to keep stores clean (or use middleware).
