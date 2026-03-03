# Design: Board Column Reorder (MVP)

## Overview
This change adds minimal column reordering for custom columns through two interaction modes: drag-and-drop and left/right controls. It preserves existing board safety rules by preventing reorder of protected default columns (`Todo`, `Doing`, `Done`) and keeps state handling mock-based.

## Goals
- Enable reordering of custom columns via drag-and-drop.
- Provide left/right move controls as a non-drag fallback.
- Block reorder operations for protected default columns.
- Reflect reorder operations in mock-backed session state.
- Keep scope focused by deferring keyboard-first reorder accessibility.

## Non-Goals
- Reordering default columns (`Todo`, `Doing`, `Done`).
- Guaranteeing reordered sequence after full page reload.
- Keyboard-first reorder interactions and advanced accessibility patterns.
- Backend/API persistence of reorder state.

## Interaction Model

### Drag-and-Drop Reorder
1. User drags a custom column.
2. User drops it at a valid target index among reorderable columns.
3. UI recalculates and applies new order.
4. Updated order is written to mock-backed in-session state.

### Left/Right Fallback Controls
1. User clicks move-left or move-right on a custom column.
2. Column swaps one position with adjacent reorderable column.
3. UI updates order and writes result to mock-backed state.

## Reorder Rules
- Only custom columns are reorderable.
- `Todo`, `Doing`, `Done` are fixed in protected order.
- Reorder attempt on protected columns is blocked with feedback.
- Move-left on leftmost reorderable position is a no-op.
- Move-right on rightmost reorderable position is a no-op.

## State Strategy
- Maintain a canonical column list in UI state.
- Reorder actions mutate order deterministically via index operations.
- Apply a guard layer before mutation:
  - reject if source column is protected
  - reject invalid target index
- Persist result in mock-backed layer for current session behavior.

## Persistence Behavior (Current Scope)
- Reorder updates are reflected in active mock-backed state.
- Full reload persistence is intentionally not guaranteed in this spec.
- This avoids introducing persistence architecture decisions before apply phase.

## Error and Feedback Strategy
- If reorder action is blocked (protected column / invalid move), state remains unchanged.
- UI should provide clear feedback for blocked actions.
- No partial reorder state should be committed on failed operations.

## Testability Notes
Required test coverage should include:
- drag reorder success between custom columns
- left/right control success cases
- no-op behavior at boundaries (leftmost/rightmost)
- blocked reorder for `Todo/Doing/Done`
- in-session mock-backed state update after reorder
- no guarantee/assertion for persisted order after full reload

## Risks and Mitigations
- **Risk:** Drag-and-drop and button controls diverge in behavior.
  - **Mitigation:** route both interaction types through shared reorder service/action.
- **Risk:** Protected columns accidentally become reorderable.
  - **Mitigation:** hard guard on protected identifiers before every reorder mutation.
- **Risk:** Misunderstanding around reload persistence.
  - **Mitigation:** explicit non-goal in spec/design/tasks and corresponding tests.
