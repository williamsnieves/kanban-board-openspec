# Apply-Phase Handoff — Task DnD Interaction

> This document is for the implementation team. It summarizes what to build, how to approach key decisions, and what existing or new store actions are required.
>
> **References:**
> - Spec: `openspec/changes/add-task-dnd-interaction/specs/task-dnd-interaction/spec.md`
> - Contract: `openspec/changes/add-task-dnd-interaction/dnd-interaction-contract.md`
> - Acceptance checklist: `openspec/changes/add-task-dnd-interaction/acceptance-checklist.md`

---

## 1. Capability Summary

The `task-dnd-interaction` change adds:

- **Drag-and-drop task movement** — users can drag a task card and drop it to reorder it within its column or move it to a different column.
- **Deterministic position normalization** — all reorder and move operations produce a stable, gap-free 0-indexed position sequence in affected columns.
- **Visual drag feedback** — the dragged card has a visible dragging state; valid drop target columns are highlighted on hover.
- **Invalid drop rollback** — dropping outside a valid column silently cancels the operation and restores the board to its pre-drag state.
- **Keyboard fallback** — arrow key controls let users move tasks without a pointer device, using the same deterministic rules as DnD.

---

## 2. Library Selection Guidance

> **Non-Goal notice:** Selecting a specific drag-and-drop library is explicitly a Non-Goal of this change (see design.md). The implementation team must evaluate options and make the final selection during the apply phase.

The spec and this contract are library-agnostic. Any library (or no library) may be used, provided it can satisfy the behavioral contract in `dnd-interaction-contract.md` and all checks in `acceptance-checklist.md`.

Options to evaluate during the apply phase include, but are not limited to:

| Option | Trade-offs to evaluate |
|--------|----------------------|
| **React-focused DnD libraries** (e.g. `@dnd-kit/core`, `react-beautiful-dnd`) | Typically provide built-in drag sensors, keyboard sensor support, and accessible patterns out of the box. Adds a dependency. |
| **Native HTML5 DnD API** | No dependency. Requires manual implementation of keyboard fallback, accessibility, and touch support. |
| **Other pointer/touch event-based libraries** | Evaluate based on accessibility support, keyboard fallback capability, and React compatibility. |

The chosen library must support: draggable elements, droppable zones with hover detection, a cancel/no-drop path, and keyboard-triggered movement that produces the same state outcomes as pointer-based drag-and-drop.

---

## 3. Required Store Actions

Implement (or verify already exist) the following store behaviors. Each must normalize positions after every mutation. The full step-by-step algorithms are defined in `dnd-interaction-contract.md` Section 1.2.

### Reorder action (same-column reorder)

The store must expose an action that accepts a column identifier, a task identifier, and a target position. When called, it removes the task from its current position in that column and inserts it at the target position. It then normalizes all positions in the column so the result is a contiguous 0-indexed sequence with no gaps.

### Move action (cross-column move)

The store must expose an action that accepts a task identifier and a target column identifier. When called, it removes the task from its source column, updates the task's column association to the target column, and appends it to the end of the target column. It then normalizes positions in both the source and target columns.

### Position normalization (shared utility)

The store must provide a shared normalization routine that, given a column's task list, reassigns each task's position value to match its index in the list (0, 1, 2, …). This routine must be called after every insertion or removal to guarantee a contiguous sequence.

---

## 4. Required UI Behaviors

All behaviors are defined in detail in `dnd-interaction-contract.md`.

| Behavior | Implementation requirement |
|----------|--------------------------|
| **Drag handle / draggable card** | Each task card must be a draggable element. The chosen library or native API must make each card (or a handle region within it) initiatable as a drag source. |
| **Drop zone per column** | Each column must register as a drop target that can receive dragged task cards. |
| **Hover highlight** | When a dragged card is over a valid column drop zone, that column must display a visible highlight. The highlight must be removed when the card leaves the zone, is dropped, or the drag is cancelled. |
| **Drag state on card** | When a card is being dragged, it must display a visible dragging state (e.g., reduced opacity or border change). This state must be removed on drop or cancel. |
| **Cancel path** | When a drag ends without a valid drop target, no store action must be called. Board state must be unchanged. |
| **Keyboard fallback** | Each focused task card must respond to `ArrowUp`, `ArrowDown`, `ArrowLeft`, and `ArrowRight` keys. See `dnd-interaction-contract.md` Section 2.1 for full operation definitions including edge cases (no-op at boundaries). |

---

## 5. `data-testid` Requirements for E2E Coverage

The following `data-testid` attributes must be present in the rendered DOM to support automated test coverage.

| Element | `data-testid` value | Notes |
|---------|--------------------|-|
| Draggable task card (or drag handle) | `drag-handle` | Applied to the draggable region of each task card. If a separate handle element is used, apply to the handle; otherwise apply to the card root. |
| Droppable column zone | `droppable-column-{Name}` | `{Name}` is the column's display name (e.g., `droppable-column-Todo`, `droppable-column-In Progress`). Applied to the column's drop zone wrapper element. |
| Focused task card (for keyboard fallback tests) | `task-card` (existing) or consistent with current convention | Keyboard fallback tests will focus this element and dispatch arrow key events. Verify the existing `data-testid` convention in the codebase. |

---

## 6. Verification

Before marking this change as complete, validate all checks in:

**`openspec/changes/add-task-dnd-interaction/acceptance-checklist.md`**

Key sections:
- Section 3.0: Drag-start checks (visible dragging state, drop targets become active).
- Section 3.1: Same-column reorder checks and cross-column move checks.
- Section 3.2: Valid drop target highlight checks and invalid drop cancel checks.
- Section 3.3: Keyboard fallback checks (all 4 arrow key operations, boundary no-ops, focus-following).
- Traceability table: confirms every check maps to a spec requirement and scenario.
