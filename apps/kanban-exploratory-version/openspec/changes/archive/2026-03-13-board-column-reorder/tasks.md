## 1. Reorder state foundation
- [x] 1.1 Ensure column order is represented explicitly in board UI state.
- [x] 1.2 Define protected default column identifiers (`Todo`, `Doing`, `Done`) in reorder guards.
- [x] 1.3 Keep reorder updates wired to mock-backed in-session state.

## 2. Drag-and-drop reorder flow
- [x] 2.1 Implement drag start/drop handling for custom columns.
- [x] 2.2 Recalculate destination index and apply deterministic reorder mutation.
- [x] 2.3 Block drag reorder attempts for protected default columns.
- [x] 2.4 Keep state unchanged when drop target is invalid.

## 3. Left/right fallback controls
- [x] 3.1 Add move-left control for reorderable custom columns.
- [x] 3.2 Add move-right control for reorderable custom columns.
- [x] 3.3 Implement boundary no-op behavior (leftmost/rightmost).
- [x] 3.4 Block fallback controls on protected default columns.

## 4. Shared reorder guardrails
- [x] 4.1 Route drag and fallback controls through shared reorder action logic.
- [x] 4.2 Enforce identical validation/guard behavior across both interaction modes.
- [x] 4.3 Provide clear UI feedback for blocked reorder operations.

## 5. Persistence behavior and scope boundaries
- [x] 5.1 Persist reorder changes in mock-backed session state.
- [x] 5.2 Do not guarantee reorder persistence after full reload (explicit scope rule).
- [x] 5.3 Keep keyboard-first reorder accessibility deferred to later spec.

## 6. Test coverage (AAA)
- [x] 6.1 Add tests for successful drag reorder of custom columns.
- [x] 6.2 Add tests for successful move-left/move-right actions.
- [x] 6.3 Add tests for boundary no-op behavior.
- [x] 6.4 Add tests that protected defaults cannot be reordered (drag and controls).
- [x] 6.5 Add tests for invalid reorder attempts keeping state unchanged.
- [x] 6.6 Add tests asserting in-session state update without full-reload persistence guarantee.

## 7. Quality checks
- [x] 7.1 Run lint/typecheck/tests for affected board modules.
- [x] 7.2 Verify no unrelated column management or card lifecycle behavior is modified.
