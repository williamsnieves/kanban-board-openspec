## Why

Task movement exists at a functional level, but MVP still needs a clear and testable interaction contract for drag-and-drop behavior. Defining this now reduces ambiguity for later implementation and verification.

## What Changes

- Add a dedicated capability that specifies drag-and-drop interaction behavior for tasks.
- Define deterministic drop semantics for same-column reorder and cross-column move.
- Add interaction feedback and error behavior requirements for invalid drops.
- Specify minimal accessibility fallback behavior for non-pointer interactions.

## Capabilities

### New Capabilities

- `task-dnd-interaction`: Drag-and-drop interaction contract for task movement and ordering.

### Modified Capabilities

- None.

## Impact

- Affected area: task interaction layer and ordering behavior.
- Downstream effect: future implementation can choose DnD library or native API while preserving the same behavior contract.
- APIs/data model: no backend changes required.
