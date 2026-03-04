## Why

FlowBoard MVP currently focuses on creating and operating boards but lacks explicit management behavior for existing boards. Defining board rename/delete and empty-state UX now prevents inconsistent behavior and supports deterministic spec-driven delivery.

## What Changes

- Add requirements for renaming an existing board with required-name validation.
- Add requirements for deleting a board with clear confirmation safeguards.
- Add empty-state UX requirements for zero-board and zero-task contexts.
- Keep persistence expectations local-first and deterministic for board management actions.
- Define validation behavior and user feedback for invalid board operations.

## Capabilities

### New Capabilities

- `board-management-basics`: Board rename/delete behavior, empty-state UX, and deterministic validation outcomes.

### Modified Capabilities

- None.

## Impact

- Affected systems: board list interactions, board metadata management, local persistence state updates.
- UX impact: clearer lifecycle handling when no boards or no tasks exist.
- APIs/dependencies: no backend changes required; remains local-first for MVP.
