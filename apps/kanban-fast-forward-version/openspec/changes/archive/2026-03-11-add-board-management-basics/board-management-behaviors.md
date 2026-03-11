# Board Management Behaviors

> Spec reference: `specs/board-management-basics/spec.md`
> Covers tasks 1.1, 1.2, 1.3

---

## Task 1.1 — Board Rename Flow

### Requirement: Board rename with deterministic validation

The rename flow is triggered from the board header or board list item. When the user initiates a rename, an inline edit field replaces the current board name display.

#### Interactive elements

| Element | `data-testid` |
|---|---|
| Rename trigger button | `board-rename-trigger` |
| Rename input field | `board-rename-input` |
| Submit rename button | `board-rename-submit` |
| Cancel rename button | `board-rename-cancel` |
| Validation error message | `board-rename-error` |

#### Scenario: Rename board with valid name

- **Precondition:** The user has initiated rename on a board. The input contains at least one non-whitespace character.
- **WHEN** the user submits the rename form with a non-empty name
- **THEN** the system:
  1. Trims leading and trailing whitespace from the submitted value.
  2. Updates the board name in application state.
  3. Reflects the updated name in all board selection views (e.g., sidebar, header, breadcrumb) without requiring a page reload.
  4. Closes the rename input and returns focus to the board header.
  5. No validation error is shown.

**Deterministic outcome:** Board name changes to the trimmed submitted value. All views displaying that board name update synchronously.

**Resolved open question:** Rename uniqueness is NOT enforced in MVP. A user may give two boards the same name. Only non-empty validation applies.

#### Scenario: Reject empty rename

- **Precondition:** The user has initiated rename on a board. The input is empty or contains only whitespace.
- **WHEN** the user submits an empty board name during rename
- **THEN** the system:
  1. Prevents the board name from being updated.
  2. Displays a deterministic validation message via `data-testid="board-rename-error"` with the text: `"Board name cannot be empty."`.
  3. Keeps the rename input open and focused so the user can correct the value.
  4. The existing board name remains unchanged in all views.

**Deterministic outcome:** Board name is unchanged. Error message is visible. Input remains open.

---

## Task 1.2 — Board Deletion Flow

### Requirement: Board delete with confirmation

Deletion is a destructive, irreversible operation in MVP. The flow requires explicit confirmation before any data is removed.

#### Interactive elements

| Element | `data-testid` |
|---|---|
| Delete trigger button | `board-delete-trigger` |
| Confirmation dialog | `board-delete-dialog` |
| Confirm deletion button | `board-delete-confirm` |
| Cancel deletion button | `board-delete-cancel` |

#### Scenario: Confirm board deletion

- **Precondition:** The user has triggered deletion on a board. The confirmation dialog (`data-testid="board-delete-dialog"`) is visible.
- **WHEN** the user confirms deletion by activating `data-testid="board-delete-confirm"`
- **THEN** the system:
  1. Removes the board and all its associated columns and tasks from application state.
  2. Removes the board and all its associated data from local persistence.
  3. Closes the confirmation dialog.
  4. Navigates to the board list / zero-board empty-state view (no automatic selection of another board).

**Deterministic outcome:** Board, columns, and tasks are fully removed from state and persistence. User lands on the board list or empty-state view.

**Resolved open question:** Post-delete navigation returns to the board list or zero-board empty state. The system does not auto-select another board.

#### Scenario: Cancel board deletion

- **Precondition:** The confirmation dialog is visible.
- **WHEN** the user cancels deletion by activating `data-testid="board-delete-cancel"` or dismisses the dialog (e.g., presses Escape or clicks outside)
- **THEN** the system:
  1. Closes the confirmation dialog without modifying any data.
  2. Returns the user to the board view they were on before triggering deletion.
  3. Board, columns, and tasks remain unchanged in both state and persistence.

**Deterministic outcome:** No data is deleted. Dialog closes. Board remains fully intact.

---

## Task 1.3 — Persistence Updates for Rename and Delete

### Requirement: Local-first persistence for board management

All board management outcomes (rename and delete) MUST be written to local storage immediately after the operation succeeds in memory. The local storage state is the source of truth for reloads and reopens.

#### Scenario: Persist rename and delete actions

##### Rename persistence

- **WHEN** a board rename succeeds (non-empty name submitted)
- **THEN** the system writes the updated board name to local storage before resolving the operation in the UI.
- **AND WHEN** the user refreshes the page or reopens the application
- **THEN** the board appears with the renamed value, not the prior name.

##### Delete persistence

- **WHEN** a board deletion is confirmed
- **THEN** the system removes the board entry and all associated column and task entries from local storage before navigating away.
- **AND WHEN** the user refreshes the page or reopens the application
- **THEN** the deleted board does not appear. If no other boards remain, the zero-board empty-state is shown.

##### Invariants

- Rename must NOT produce a partial write: if the write fails, the in-memory state reverts to the previous name.
- Delete must NOT produce a partial write: all board, column, and task data for that board are removed atomically within the same local storage update operation.
- No network call is required; all persistence is local-first.

---

*Next artifact:* `empty-state-ux.md` (Tasks 2.1, 2.2, 2.3)
