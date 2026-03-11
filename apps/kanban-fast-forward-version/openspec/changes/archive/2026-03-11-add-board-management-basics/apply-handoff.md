# Apply-Phase Handoff Notes

> Spec reference: `specs/board-management-basics/spec.md`
> Covers task 3.3

---

## Purpose

This document gives the implementation team everything needed to execute the apply phase for the `add-board-management-basics` change without revisiting design decisions.

---

## Resolved Decisions

| Question | Resolution |
|---|---|
| Rename uniqueness in MVP? | NOT enforced. Non-empty validation only. Two boards may share the same name. |
| Post-delete navigation? | Navigate to board list / zero-board empty state. No auto-selection of another board. |
| Undo / soft delete? | Not in MVP. Deletion is immediate and irreversible at this scope. |
| Server-side persistence? | Not in scope. Local-first only (localStorage). |

---

## Artifacts Reference

| File | Contents |
|---|---|
| `board-management-behaviors.md` | Rename flow (tasks 1.1), delete flow (task 1.2), persistence invariants (task 1.3) |
| `empty-state-ux.md` | Zero-board empty state (task 2.1), empty-board guidance (task 2.2), state-transition rules (task 2.3) |
| `acceptance-checklist.md` | Requirement-to-acceptance mapping (task 3.1), deterministic outcome table (task 3.2) |

---

## Implementation Scope

The following behaviors MUST be implemented. Nothing outside this list is in scope for this change.

### Board rename

1. A rename trigger is accessible from each board's header or board-list item.
2. Activating the trigger replaces the board name display with an editable input pre-filled with the current name.
3. Submitting the input validates that the trimmed value is non-empty.
   - **Valid:** trim and save to state and localStorage; close input; update all board-name displays synchronously.
   - **Invalid:** show error message `"Board name cannot be empty."` via `data-testid="board-rename-error"`; keep input open and focused; do not save.
4. A cancel control closes the input without saving.

### Board delete

1. A delete trigger is accessible from each board's header or board-list item.
2. Activating the trigger opens a confirmation dialog (`data-testid="board-delete-dialog"`).
3. The dialog presents two choices: confirm (`data-testid="board-delete-confirm"`) and cancel (`data-testid="board-delete-cancel"`).
   - **Confirm:** remove board, columns, and tasks from state and localStorage atomically; navigate to board list / zero-board empty state.
   - **Cancel / dismiss (Escape, outside-click):** close dialog; leave all data unchanged.

### Empty states

1. Zero-board empty state (`data-testid="empty-state-no-boards"`) — render when board count = 0; include `data-testid="empty-state-create-board-cta"`.
2. Empty-board guidance (`data-testid="empty-state-no-tasks"`) — render inside a board when task count across all columns = 0; include `data-testid="empty-state-create-task-cta"`.
3. Only one empty-state level active at a time (zero-board takes precedence; never render both simultaneously).
4. Transitions between empty and populated states are synchronous with state changes; no page reload required.

### Persistence

1. Rename writes to localStorage before resolving in the UI.
2. Delete removes board, columns, and tasks from localStorage atomically before navigating away.
3. On page refresh or reopen, the correct state is restored from localStorage — no flash of previous state.

---

## data-testid Inventory

Use these exact values during implementation. QA tests will target them.

| Element | `data-testid` |
|---|---|
| Rename trigger | `board-rename-trigger` |
| Rename input | `board-rename-input` |
| Rename submit | `board-rename-submit` |
| Rename cancel | `board-rename-cancel` |
| Rename validation error | `board-rename-error` |
| Delete trigger | `board-delete-trigger` |
| Delete confirmation dialog | `board-delete-dialog` |
| Delete confirm button | `board-delete-confirm` |
| Delete cancel button | `board-delete-cancel` |
| Zero-board empty state container | `empty-state-no-boards` |
| Create board CTA | `empty-state-create-board-cta` |
| Empty-board guidance container | `empty-state-no-tasks` |
| Create task CTA | `empty-state-create-task-cta` |

---

## Out of Scope (do not implement in this change)

- Server-side board management APIs
- Collaboration or permission semantics
- Undo / soft delete for boards
- Enforcing unique board names
- Auto-selection of another board after deletion
- Any board management feature not explicitly listed in the spec scenarios

---

## Future Enhancements (documented for backlog)

- **Undo / soft delete:** Allow recovery of accidentally deleted boards (deferred).
- **Rename uniqueness enforcement:** Warn when a duplicate name is used (deferred).
- **Auto-select next board after deletion:** Convenience navigation after delete (deferred, requires UX decision).

---

*End of apply-phase handoff. All artifacts are ready for implementation.*
