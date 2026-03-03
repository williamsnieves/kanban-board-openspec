## 1. Reorder state foundation
- [ ] 1.1 Ensure column order is represented explicitly in board UI state.
- [ ] 1.2 Define protected default column identifiers (`Todo`, `Doing`, `Done`) in reorder guards.
- [ ] 1.3 Keep reorder updates wired to mock-backed in-session state.

## 2. Drag-and-drop reorder flow
- [ ] 2.1 Implement drag start/drop handling for custom columns.
- [ ] 2.2 Recalculate destination index and apply deterministic reorder mutation.
- [ ] 2.3 Block drag reorder attempts for protected default columns.
- [ ] 2.4 Keep state unchanged when drop target is invalid.

## 3. Left/right fallback controls
- [ ] 3.1 Add move-left control for reorderable custom columns.
- [ ] 3.2 Add move-right control for reorderable custom columns.
- [ ] 3.3 Implement boundary no-op behavior (leftmost/rightmost).
- [ ] 3.4 Block fallback controls on protected default columns.

## 4. Shared reorder guardrails
- [ ] 4.1 Route drag and fallback controls through shared reorder action logic.
- [ ] 4.2 Enforce identical validation/guard behavior across both interaction modes.
- [ ] 4.3 Provide clear UI feedback for blocked reorder operations.

## 5. Persistence behavior and scope boundaries
- [ ] 5.1 Persist reorder changes in mock-backed session state.
- [ ] 5.2 Do not guarantee reorder persistence after full reload (explicit scope rule).
- [ ] 5.3 Keep keyboard-first reorder accessibility deferred to later spec.

## 6. Test coverage (AAA)
- [ ] 6.1 Add tests for successful drag reorder of custom columns.
- [ ] 6.2 Add tests for successful move-left/move-right actions.
- [ ] 6.3 Add tests for boundary no-op behavior.
- [ ] 6.4 Add tests that protected defaults cannot be reordered (drag and controls).
- [ ] 6.5 Add tests for invalid reorder attempts keeping state unchanged.
- [ ] 6.6 Add tests asserting in-session state update without full-reload persistence guarantee.

## 7. Quality checks
- [ ] 7.1 Run lint/typecheck/tests for affected board modules.
- [ ] 7.2 Verify no unrelated column management or card lifecycle behavior is modified.
