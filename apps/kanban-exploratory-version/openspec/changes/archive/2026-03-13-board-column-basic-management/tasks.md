## 1. Column state foundations
- [x] 1.1 Ensure board state supports custom column create/rename/delete operations.
- [x] 1.2 Keep persistence mock-backed for all column management actions.
- [x] 1.3 Define/confirm protected default column identifiers (`Todo`, `Doing`, `Done`).

## 2. Shared column-name validation
- [x] 2.1 Implement shared validation for non-empty trimmed column names.
- [x] 2.2 Implement case-insensitive uniqueness check across all column names.
- [x] 2.3 Reuse same validation path for both create and rename flows.
- [x] 2.4 Provide clear UI feedback when validation fails.

## 3. Create column flow
- [x] 3.1 Implement create-column action for valid custom names.
- [x] 3.2 Reject create attempts with empty/whitespace names.
- [x] 3.3 Reject create attempts with duplicate case-insensitive names.
- [x] 3.4 Persist successful create operations in mock-backed state.

## 4. Rename column flow
- [x] 4.1 Implement rename-column action.
- [x] 4.2 Reject rename attempts with empty/whitespace names.
- [x] 4.3 Reject rename attempts that collide with existing names (case-insensitive).
- [x] 4.4 Keep original name unchanged when rename is rejected.
- [x] 4.5 Persist successful rename operations in mock-backed state.

## 5. Delete column flow
- [x] 5.1 Implement delete-column action for custom columns.
- [x] 5.2 Block deletion for protected default columns (`Todo`, `Doing`, `Done`).
- [x] 5.3 Block deletion when target custom column contains cards.
- [x] 5.4 Allow deletion only for empty custom columns.
- [x] 5.5 Persist successful deletions in mock-backed state.

## 6. Scope guards
- [x] 6.1 Ensure manual column reorder is not implemented in this change.
- [x] 6.2 Ensure no unrelated board/card functionality is modified.

## 7. Test coverage (AAA)
- [x] 7.1 Add tests for create success and create validation failures.
- [x] 7.2 Add tests for rename success and rename validation failures.
- [x] 7.3 Add tests that protected default columns cannot be deleted.
- [x] 7.4 Add tests that non-empty custom columns cannot be deleted.
- [x] 7.5 Add tests that empty custom columns can be deleted.
- [x] 7.6 Add tests for case-insensitive uniqueness behavior.

## 8. Quality checks
- [x] 8.1 Run lint/typecheck/tests for affected modules.
- [x] 8.2 Verify mock rehydration reflects column create/rename/delete outcomes.
