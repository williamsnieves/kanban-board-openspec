## 1. Column state foundations
- [ ] 1.1 Ensure board state supports custom column create/rename/delete operations.
- [ ] 1.2 Keep persistence mock-backed for all column management actions.
- [ ] 1.3 Define/confirm protected default column identifiers (`Todo`, `Doing`, `Done`).

## 2. Shared column-name validation
- [ ] 2.1 Implement shared validation for non-empty trimmed column names.
- [ ] 2.2 Implement case-insensitive uniqueness check across all column names.
- [ ] 2.3 Reuse same validation path for both create and rename flows.
- [ ] 2.4 Provide clear UI feedback when validation fails.

## 3. Create column flow
- [ ] 3.1 Implement create-column action for valid custom names.
- [ ] 3.2 Reject create attempts with empty/whitespace names.
- [ ] 3.3 Reject create attempts with duplicate case-insensitive names.
- [ ] 3.4 Persist successful create operations in mock-backed state.

## 4. Rename column flow
- [ ] 4.1 Implement rename-column action.
- [ ] 4.2 Reject rename attempts with empty/whitespace names.
- [ ] 4.3 Reject rename attempts that collide with existing names (case-insensitive).
- [ ] 4.4 Keep original name unchanged when rename is rejected.
- [ ] 4.5 Persist successful rename operations in mock-backed state.

## 5. Delete column flow
- [ ] 5.1 Implement delete-column action for custom columns.
- [ ] 5.2 Block deletion for protected default columns (`Todo`, `Doing`, `Done`).
- [ ] 5.3 Block deletion when target custom column contains cards.
- [ ] 5.4 Allow deletion only for empty custom columns.
- [ ] 5.5 Persist successful deletions in mock-backed state.

## 6. Scope guards
- [ ] 6.1 Ensure manual column reorder is not implemented in this change.
- [ ] 6.2 Ensure no unrelated board/card functionality is modified.

## 7. Test coverage (AAA)
- [ ] 7.1 Add tests for create success and create validation failures.
- [ ] 7.2 Add tests for rename success and rename validation failures.
- [ ] 7.3 Add tests that protected default columns cannot be deleted.
- [ ] 7.4 Add tests that non-empty custom columns cannot be deleted.
- [ ] 7.5 Add tests that empty custom columns can be deleted.
- [ ] 7.6 Add tests for case-insensitive uniqueness behavior.

## 8. Quality checks
- [ ] 8.1 Run lint/typecheck/tests for affected modules.
- [ ] 8.2 Verify mock rehydration reflects column create/rename/delete outcomes.
