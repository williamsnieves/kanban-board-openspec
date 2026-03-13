# Change: Board Column Basic Management

## Why
After establishing default columns and basic card lifecycle, the MVP still lacks controlled column management operations. Teams need minimal column administration to adapt board structure without introducing advanced workflow complexity.

This change defines the smallest safe set of column management capabilities while protecting default workflow semantics and keeping scope aligned with mock-based exploratory delivery.

## What Changes
- Add minimal column management lifecycle for MVP:
  - create column
  - rename column
  - delete column (only when empty)
- Protect default columns `Todo`, `Doing`, and `Done` from deletion.
- Enforce column name validation:
  - non-empty after trim
  - unique across board with case-insensitive comparison
- Keep persistence mock-based (no backend/API integration in this change).
- Explicitly keep manual column reorder out of scope for this change.
- Preserve all existing board/card behaviors from prior specs without modifying unrelated scope.

## Impact
- Affected specs:
  - New/updated board-column capability spec for MVP column management behavior.
- Affected code:
  - UI column management flows (create/rename/delete checks) in board view state handling.
  - Mock data fixtures and scenarios for column validation and protected/default column behavior.
