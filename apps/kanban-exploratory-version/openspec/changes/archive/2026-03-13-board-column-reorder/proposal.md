# Change: Board Column Reorder

## Why
After defining baseline column management, users still need a direct way to adjust visual workflow order for custom columns. Reordering improves board usability and adaptability without changing core column lifecycle semantics.

This change adds minimal reorder capability with clear MVP boundaries and preserves safety constraints defined in prior specs.

## What Changes
- Add manual column reorder capability for custom columns using:
  - drag-and-drop interaction
  - left/right move controls as fallback
- Keep default columns `Todo`, `Doing`, and `Done` protected from reorder actions.
- Keep reorder state in mock-backed persistence for this phase.
- Explicitly do not persist custom reorder across full view reload for this change.
- Defer keyboard-first reorder accessibility behavior to a later spec.
- Keep existing create/rename/delete column rules unchanged.

## Impact
- Affected specs:
  - New/updated board-column reorder capability spec for MVP interaction behavior.
- Affected code:
  - UI interaction handling for drag-and-drop and left/right controls.
  - Mock-backed board state updates for in-session reorder behavior.
