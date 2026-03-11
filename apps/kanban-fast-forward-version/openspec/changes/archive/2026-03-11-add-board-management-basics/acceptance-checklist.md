# Acceptance Checklist

> Spec reference: `specs/board-management-basics/spec.md`
> Covers tasks 3.1, 3.2

---

## Task 3.1 — Requirement-to-Acceptance Mapping

Each spec requirement and scenario maps to one or more acceptance checks below. All checks must pass for the change to be considered implemented.

---

### Requirement: Board rename with deterministic validation

#### Scenario: Rename board with valid name

- [ ] `data-testid="board-rename-trigger"` is present on each board and activates the rename input.
- [ ] `data-testid="board-rename-input"` is rendered when rename mode is active.
- [ ] Submitting a non-empty name via `data-testid="board-rename-submit"` updates the board name in the board header and all board-selection views without page reload.
- [ ] Leading and trailing whitespace in the submitted name is trimmed before saving.
- [ ] `data-testid="board-rename-error"` is NOT visible after a successful rename.

#### Scenario: Reject empty rename

- [ ] Submitting an empty string (or whitespace-only) via `data-testid="board-rename-submit"` does NOT update the board name.
- [ ] `data-testid="board-rename-error"` becomes visible with the message `"Board name cannot be empty."`.
- [ ] The rename input remains open and focused after rejection.
- [ ] The board name in all views is unchanged after rejection.

---

### Requirement: Board delete with confirmation

#### Scenario: Confirm board deletion

- [ ] `data-testid="board-delete-trigger"` is present on each board and opens `data-testid="board-delete-dialog"`.
- [ ] `data-testid="board-delete-dialog"` is visible after triggering deletion.
- [ ] Activating `data-testid="board-delete-confirm"` removes the board, its columns, and its tasks from application state.
- [ ] After confirmation, the deleted board no longer appears in the board-selection view.
- [ ] After confirmation, the user is navigated to the board list or zero-board empty-state view — no other board is auto-selected.

#### Scenario: Cancel board deletion

- [ ] Activating `data-testid="board-delete-cancel"` closes `data-testid="board-delete-dialog"` without modifying any data.
- [ ] Dismissing the dialog via Escape key or outside-click also closes it without deleting data.
- [ ] After cancellation, the board, its columns, and its tasks are unchanged.
- [ ] After cancellation, the user remains on the same board view they were on before triggering deletion.

---

### Requirement: Empty-state UX for zero boards

#### Scenario: No boards available

- [ ] `data-testid="empty-state-no-boards"` is rendered when board count = 0.
- [ ] `data-testid="empty-state-create-board-cta"` is rendered within the zero-board empty state.
- [ ] Activating `data-testid="empty-state-create-board-cta"` opens the board creation flow.
- [ ] After creating the first board, `data-testid="empty-state-no-boards"` is no longer rendered.
- [ ] The board-selection sidebar shows zero board items when board count = 0.

---

### Requirement: Empty-state UX for empty board

#### Scenario: Board with no tasks

- [ ] `data-testid="empty-state-no-tasks"` is rendered inside a board when task count across all columns = 0.
- [ ] `data-testid="empty-state-create-task-cta"` is rendered within the empty-board guidance.
- [ ] Activating `data-testid="empty-state-create-task-cta"` opens the task creation flow for that board.
- [ ] After creating the first task, `data-testid="empty-state-no-tasks"` is no longer rendered.
- [ ] `data-testid="empty-state-no-tasks"` is NOT rendered when at least one task exists in any column.
- [ ] `data-testid="empty-state-no-boards"` and `data-testid="empty-state-no-tasks"` are never both rendered simultaneously.

---

### Requirement: Local-first persistence for board management

#### Scenario: Persist rename and delete actions

- [ ] After renaming a board, refreshing the page shows the board with the updated name.
- [ ] After deleting a board, refreshing the page confirms the board is absent.
- [ ] After deleting the last board and refreshing, the zero-board empty state is shown.
- [ ] After renaming, the previous board name does NOT appear anywhere in the restored state.

---

## Task 3.2 — Deterministic Outcomes for Invalid and Cancel Flows

The following table defines the exact, deterministic outcome for each failure or cancellation path. Implementations MUST match these outcomes exactly.

| Flow | Action | Expected outcome |
|---|---|---|
| Rename → empty submit | User submits whitespace-only or empty input | Name unchanged; `board-rename-error` shown with text `"Board name cannot be empty."`; input stays open and focused |
| Rename → cancel | User activates `board-rename-cancel` | Name unchanged; rename input closes; no error shown |
| Delete → cancel (button) | User activates `board-delete-cancel` | Dialog closes; board, columns, tasks all unchanged; user stays on same board |
| Delete → cancel (Escape / outside click) | User dismisses dialog without confirming | Same as cancel button outcome |
| Delete → confirm → refresh | User confirms deletion then reloads page | Board absent; if last board: zero-board empty state shown; otherwise: board list without deleted board |
| Rename → valid submit → refresh | User renames board then reloads page | Board shown with new name; old name does not appear |

### Additional invariants

- The rename submit button (`board-rename-submit`) MUST be the only trigger that validates and saves; pressing Enter on the input field is equivalent to activating the submit button.
- The delete confirmation dialog MUST NOT auto-confirm: it must wait for explicit user activation of `board-delete-confirm`.
- An invalid rename attempt does NOT close the rename input — it stays open for correction.
- A cancel action on rename or delete does NOT leave any intermediate or dirty state in local storage.

---

*Next artifact:* `apply-handoff.md` (Task 3.3)
