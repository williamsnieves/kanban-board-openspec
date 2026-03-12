# Change: Board Card Basic CRUD

## Why
After defining app foundation and default board columns, the next MVP capability is the minimal card lifecycle. Without basic card operations, the board cannot represent actual work items and cannot be used as a functional Kanban flow.

This change introduces the smallest useful set of card behaviors while keeping scope controlled and aligned with exploratory development.

## What Changes
- Define minimal card lifecycle on existing board columns:
  - create card
  - edit card title
  - delete card
  - move card between columns
- Restrict card data in this spec to one field: `title`.
- Enforce title validation: at least one non-whitespace character.
- Define default ordering behavior within a column as append-to-end.
- Require delete confirmation in UI before removing a card.
- Keep state persistence in mock data (no backend/API integration in this change).
- Preserve card identity (`id`) across updates and move operations.
- Explicitly exclude advanced card metadata and workflows from scope:
  - description, labels, assignee, due date, priority
  - comments, attachments, subtasks
  - audit/activity history

## Impact
- Affected specs:
  - New/updated board-card capability spec for MVP card lifecycle.
- Affected code:
  - UI card interactions and local state handling using mock data.
  - Mock fixtures for create/edit/delete/move scenarios and edge cases.
