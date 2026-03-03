## 1. Card model and state foundation
- [ ] 1.1 Define minimal card model for this change (`id`, `title`).
- [ ] 1.2 Ensure board state shape supports card arrays per column.
- [ ] 1.3 Keep persistence source mock-backed for all card operations.

## 2. Create card flow
- [ ] 2.1 Implement create-card action targeting a selected column.
- [ ] 2.2 Validate title input (`trim(title).length >= 1`) before creation.
- [ ] 2.3 Generate stable card identity (`id`) on create.
- [ ] 2.4 Append newly created card to end of destination column.
- [ ] 2.5 Add UI validation feedback for invalid title creation attempts.

## 3. Edit card title flow
- [ ] 3.1 Implement edit-card action for title updates.
- [ ] 3.2 Reuse title validation rule for edit operations.
- [ ] 3.3 Preserve original card `id` during title updates.
- [ ] 3.4 Keep previous title unchanged when edit input is invalid.

## 4. Delete card flow
- [ ] 4.1 Implement delete-card request interaction.
- [ ] 4.2 Require confirmation before deletion is executed.
- [ ] 4.3 Remove card only when confirmation is accepted.
- [ ] 4.4 Keep state unchanged when confirmation is cancelled.

## 5. Move card flow
- [ ] 5.1 Implement move-card action between existing columns.
- [ ] 5.2 Preserve card `id` when moving.
- [ ] 5.3 Append moved card to end of destination column.
- [ ] 5.4 Handle same-column move as safe no-op (no duplicates).

## 6. Mock persistence and rehydration checks
- [ ] 6.1 Persist create/edit/delete/move results in mock-backed state.
- [ ] 6.2 Rehydrate board state from mocks and verify expected card outcomes.

## 7. Test coverage (TDD-aligned)
- [ ] 7.1 Add unit tests for create (valid and invalid title).
- [ ] 7.2 Add unit tests for edit (valid and invalid title).
- [ ] 7.3 Add unit tests for delete (confirm and cancel paths).
- [ ] 7.4 Add unit tests for move (different column and same-column no-op).
- [ ] 7.5 Add assertions for append ordering and identity preservation.
- [ ] 7.6 Keep tests in AAA structure.

## 8. Quality checks
- [ ] 8.1 Run lint/typecheck/tests for affected modules.
- [ ] 8.2 Confirm advanced card metadata remains out of scope in this change.
