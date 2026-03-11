# Empty-State UX

> Spec reference: `specs/board-management-basics/spec.md`
> Covers tasks 2.1, 2.2, 2.3

---

## Task 2.1 — Zero-Board Empty State

### Requirement: Empty-state UX for zero boards

When the application contains no boards, the main content area MUST display a dedicated empty-state view instead of a blank or errored board panel.

#### Interactive elements

| Element | `data-testid` |
|---|---|
| Zero-board empty-state container | `empty-state-no-boards` |
| Create board call-to-action button | `empty-state-create-board-cta` |

#### Scenario: No boards available

- **Precondition:** Application state contains zero boards (initial load with no persisted data, or all boards have been deleted).
- **WHEN** the application state contains zero boards
- **THEN** the system:
  1. Renders the zero-board empty-state container (`data-testid="empty-state-no-boards"`) as the primary content view.
  2. Displays a heading or label communicating that no boards exist yet (e.g., "No boards yet").
  3. Displays a call-to-action to create the first board (`data-testid="empty-state-create-board-cta"`).
  4. Activating the CTA opens the board creation flow (the same flow triggered from the sidebar or navigation).
  5. The sidebar or board selector reflects zero boards (shows no board items).

**Deterministic outcome:** User always sees the empty-state container and the CTA when board count is zero. There is no blank screen, no error message, and no auto-redirect.

---

## Task 2.2 — Empty-Board (No Tasks) Guidance State

### Requirement: Empty-state UX for empty board

When a board exists but all its columns contain zero tasks, the board content area MUST display guidance to create the first task.

#### Interactive elements

| Element | `data-testid` |
|---|---|
| Empty-board guidance container | `empty-state-no-tasks` |
| Create first task call-to-action | `empty-state-create-task-cta` |

#### Scenario: Board with no tasks

- **Precondition:** A board exists and is open. The board has zero tasks across all of its columns (columns may exist but are empty, or the board itself has no columns yet).
- **WHEN** the user opens a board where all columns are empty
- **THEN** the system:
  1. Renders the empty-board guidance container (`data-testid="empty-state-no-tasks"`) inside the board content area.
  2. Displays a heading or label communicating that no tasks exist yet (e.g., "No tasks yet").
  3. Displays a call-to-action to create the first task (`data-testid="empty-state-create-task-cta"`).
  4. Activating the CTA opens the task creation flow for that board.
  5. Column structure is still rendered (column headers visible if columns exist); the empty-state guidance appears within or below the column area.

**Deterministic outcome:** User always sees the task empty-state container and the CTA when the board has no tasks. The board frame (name, columns) remains visible.

**Note:** This empty state applies only when task count across all columns is zero. If at least one task exists in any column, this empty state MUST NOT be shown.

---

## Task 2.3 — Consistency Rules for State Transitions

### Transitions between empty and populated states

The empty-state views are derived purely from application state. They appear and disappear deterministically as data changes — no manual toggle or special routing is required.

#### Zero-board ↔ Boards exist

| Condition | View shown |
|---|---|
| Board count = 0 | Zero-board empty state (`empty-state-no-boards`) |
| Board count ≥ 1 (and a board is selected or navigated to) | Board content view |

- **WHEN** the user creates the first board from the zero-board empty state CTA
- **THEN** the zero-board empty state is immediately replaced by the new board's view (or board list with the new board selected), without a page reload.

- **WHEN** the user deletes the last remaining board
- **THEN** the zero-board empty state is immediately shown, without a page reload.

#### Empty-board ↔ Tasks exist

| Condition | View shown inside board |
|---|---|
| Task count across all columns = 0 | Empty-board guidance (`empty-state-no-tasks`) |
| Task count across all columns ≥ 1 | Task list in columns (normal board view) |

- **WHEN** the user creates the first task from the empty-board CTA
- **THEN** the empty-board guidance is immediately replaced by the task in its column, without a page reload.

- **WHEN** the last task in a board is deleted
- **THEN** the empty-board guidance is immediately shown within the board, without a page reload.

#### Invariants

1. Only one empty-state level is active at a time: the system cannot show both `empty-state-no-boards` and `empty-state-no-tasks` simultaneously.
2. The zero-board empty state takes precedence: if there are no boards, the board-level empty state is never rendered.
3. Transitions are synchronous with state changes — no loading spinner or delay is introduced for local-first operations.
4. After page refresh, the correct empty-state (or board view) is re-derived from persisted local storage state and shown without flicker.

---

*Next artifact:* `acceptance-checklist.md` (Tasks 3.1, 3.2)
