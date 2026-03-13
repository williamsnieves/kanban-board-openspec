## Why

The MVP PRD requires reordering tasks within a column (FR-9), but current exploratory specs leave that behavior uncovered as a standalone requirement set. Defining this change now closes a direct MVP gap with minimal scope and prevents ambiguity before implementation.

## What Changes

- Add a dedicated requirement set for task reordering within the same column (intra-column reorder only).
- Define deterministic behavior for moving a task from source position to destination position in the same column.
- Define safe no-op behavior when source and destination are the same position.
- Define rejection behavior for invalid reorder inputs without mutating board state.
- Keep interaction method implementation-agnostic in this spec (drag-and-drop remains preferred, not required).
- Explicitly keep out of scope:
  - persistence behavior for this change,
  - cross-column task movement behavior,
  - task metadata or collaboration features.

## Capabilities

### New Capabilities

- `board-task-order`: Covers MVP task reorder behavior inside a single column, including deterministic position updates, no-op handling, and invalid-input safety.

### Modified Capabilities

- None.

## Impact

- Adds one new delta spec file under `openspec/changes/board-task-in-column-reorder/specs/board-task-order/spec.md`.
- Impacts board domain behavior definition for task ordering semantics within a column.
- No API contract changes.
- No persistence/storage dependency changes.
- No changes to cross-column movement requirements.
