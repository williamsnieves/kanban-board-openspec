# DnD Interaction Contract

> Source spec: `openspec/changes/add-task-dnd-interaction/specs/task-dnd-interaction/spec.md`

---

## Section 1.1 — Behavior Confirmation

This section confirms each drag-and-drop behavior declared in the spec, mapping it to its requirement, observable UI state change, and required store mutation.

---

### Behavior 1: Drag Start

**Spec requirement:** Draggable task interaction — *"The system SHALL allow users to start dragging a task card from its current column and indicate that the task is in dragging state."*

**Spec scenario:** Start dragging a task
- WHEN the user initiates drag on a task card
- THEN the task enters a visible dragging state and can be moved to eligible drop targets

| Dimension | Definition |
|-----------|-----------|
| Observable UI state | The dragged card is visually distinct (e.g., reduced opacity, outline, or ghost image). All valid drop target columns become active/ready to receive the card. |
| Store mutation | A transient drag context is set: `dragContext = { taskId, sourceColumnId, sourcePosition }`. No task data is mutated until drop. |

---

### Behavior 2: Hover (Valid Target Highlight)

**Spec requirement:** Valid and invalid drop feedback — *"The system SHALL provide explicit visual feedback for valid drop targets and block invalid drops without corrupting task order."*

**Spec scenario:** Valid drop target highlight
- WHEN a dragged task hovers over a valid target
- THEN the target is visually highlighted as droppable

| Dimension | Definition |
|-----------|-----------|
| Observable UI state | The column currently under the drag pointer displays a highlight (e.g., a colored border or background tint). The highlight moves with the pointer as the user drags across columns. |
| Store mutation | No task data is mutated during hover. Highlight is driven by local component state (e.g., `isOver` flag from DnD library). |

---

### Behavior 3: Drop — Same Column Reorder

**Spec requirement:** Deterministic drop and reorder behavior — *"The system SHALL apply deterministic ordering rules when a dragged task is dropped within the same column or across columns."*

**Spec scenario:** Drop within same column
- WHEN the user drops a dragged task at a new position in the same column
- THEN the system reorders tasks to match the drop position and normalizes positions deterministically

| Dimension | Definition |
|-----------|-----------|
| Observable UI state | The card settles at its new position in the column. All sibling cards shift accordingly. The order reflects the drop target index, not the original index. |
| Store mutation | `reorderTask(columnId, taskId, newPosition)` is called. The task is removed from its current position, inserted at `newPosition`, and `normalizePositions()` is applied to the column's task array. Result: stable 0-indexed integer sequence with no gaps. |

---

### Behavior 4: Drop — Cross-Column Move

**Spec requirement:** Deterministic drop and reorder behavior (same as above).

**Spec scenario:** Drop across columns
- WHEN the user drops a dragged task into a different column
- THEN the system updates the task column and inserts it at a deterministic target position

| Dimension | Definition |
|-----------|-----------|
| Observable UI state | The card disappears from the source column and appears at the bottom of (or at the specified position in) the target column. Source column closes the gap left by the moved card. |
| Store mutation | `moveTask(taskId, targetColumnId)` is called. The task is removed from the source column, its `columnId` is updated to `targetColumnId`, it is inserted at `position = target.tasks.length` (end of target), and `normalizePositions()` is called on both columns. |

---

### Behavior 5: Cancel / Invalid Drop

**Spec requirement:** Valid and invalid drop feedback — *"The system SHALL provide explicit visual feedback for valid drop targets and block invalid drops without corrupting task order."*

**Spec scenario:** Invalid drop attempt
- WHEN a dragged task is released over an invalid target
- THEN the system cancels the move and returns the task to its original position

| Dimension | Definition |
|-----------|-----------|
| Observable UI state | The card animates back to its original position (or snaps back without animation). No column highlight persists. The board looks identical to the state before dragging began. |
| Store mutation | No store mutation occurs. The drag context (`dragContext`) is cleared. Board state (all `columnId`, `position` values) is byte-for-byte identical to state before drag started. |

---

## Section 1.2 — Implementation Checklist: Deterministic Reorder and Cross-Column Insertion Rules

These rules are library-agnostic. Any DnD implementation must follow them exactly to guarantee deterministic outcomes.

---

### Same-Column Reorder Rules

Given: `columnId`, `taskId`, `newPosition` (0-indexed integer)

1. Retrieve the mutable task array for `columnId`.
2. Find the current index of `taskId` in the array.
3. Remove `taskId` from its current index (splice out).
4. Insert `taskId` at `newPosition` in the array.
5. Call `normalizePositions(tasks)` on the updated array.
   - `normalizePositions` assigns `position = index` for each task in order (0, 1, 2, …).
6. Persist the updated array to the store.

**Result invariant:** After this operation, the task array for `columnId` is a contiguous 0-indexed integer sequence with no duplicates and no gaps.

---

### Cross-Column Move Rules

Given: `taskId`, `sourceColumnId`, `targetColumnId`

1. Retrieve the mutable task array for `sourceColumnId`.
2. Remove `taskId` from the source array (splice out).
3. Call `normalizePositions(sourceTasks)` on the source array.
4. Retrieve the mutable task array for `targetColumnId`.
5. Set `task.columnId = targetColumnId`.
6. Set `task.position = targetTasks.length` (append to end).
7. Insert `task` at the end of the target array.
8. Call `normalizePositions(targetTasks)` on the target array.
9. Persist both updated arrays to the store.

**Result invariants:**
- Source column: contiguous 0-indexed sequence, no gap where task was removed.
- Target column: contiguous 0-indexed sequence, moved task at last position.
- `task.columnId` equals `targetColumnId`.

---

## Section 2.1 — Keyboard Fallback Operations

These operations are the keyboard-accessible equivalents of drag-and-drop. They produce **identical state outcomes** using the same deterministic rules defined in Section 1.2.

**Design resolution:** Arrow key controls are used (simplest, most deterministic choice for MVP). A task must be focused/selected before keyboard movement is triggered.

---

### Operation: Move Task Up (Same Column)

| Field | Value |
|-------|-------|
| Trigger | `ArrowUp` key while a task card is focused |
| Precondition | Task is focused/selected; task is not already at position 0 |
| State outcome | Equivalent to same-column reorder with `newPosition = currentPosition - 1` |
| UI feedback | Task card moves up one slot visibly; focus follows the card; no error state |

---

### Operation: Move Task Down (Same Column)

| Field | Value |
|-------|-------|
| Trigger | `ArrowDown` key while a task card is focused |
| Precondition | Task is focused/selected; task is not already at the last position in its column |
| State outcome | Equivalent to same-column reorder with `newPosition = currentPosition + 1` |
| UI feedback | Task card moves down one slot visibly; focus follows the card; no error state |

---

### Operation: Move Task Left (Cross-Column, to Previous Column)

| Field | Value |
|-------|-------|
| Trigger | `ArrowLeft` key while a task card is focused |
| Precondition | Task is focused/selected; a column exists to the left of the current column |
| State outcome | Equivalent to cross-column move: `moveTask(taskId, previousColumnId)`. Task inserted at end of previous column. |
| UI feedback | Task card disappears from current column, appears at the bottom of the previous column; focus follows the card; no error state |

---

### Operation: Move Task Right (Cross-Column, to Next Column)

| Field | Value |
|-------|-------|
| Trigger | `ArrowRight` key while a task card is focused |
| Precondition | Task is focused/selected; a column exists to the right of the current column |
| State outcome | Equivalent to cross-column move: `moveTask(taskId, nextColumnId)`. Task inserted at end of next column. |
| UI feedback | Task card disappears from current column, appears at the bottom of the next column; focus follows the card; no error state |

---

**Edge cases (no-op scenarios for keyboard fallback):**
- `ArrowUp` when task is at position 0: no action, no error.
- `ArrowDown` when task is at the last position in its column: no action, no error.
- `ArrowLeft` when task is in the leftmost column: no action, no error.
- `ArrowRight` when task is in the rightmost column: no action, no error.

---

## Section 2.2 — Invalid-Drop Rollback and Feedback Verification

---

### Invalid Drop Scenarios

#### Scenario A: Drop Outside Any Column

| Field | Definition |
|-------|-----------|
| Description | User releases drag over empty board area, page header, footer, or any non-column region |
| Detection | DnD event fires with no valid `droppableId` / column target (target is `null` or not in the set of registered drop zones) |
| Rollback | No store mutation. Task retains its original `columnId` and `position`. Drag context cleared. |
| Feedback | Column highlight removed. Card snaps/animates back to original position. No error message shown. |
| Invariant | Board state after the event is byte-for-byte identical to the state before drag started. |

---

#### Scenario B: Drop at Same Position (No-Op)

| Field | Definition |
|-------|-----------|
| Description | User releases drag at the identical position in the same column the task was already in |
| Detection | Drop event fires with `targetColumnId === sourceColumnId` AND `newPosition === sourcePosition` |
| Rollback | No store mutation (treated as a no-op). Drag context cleared. |
| Feedback | Card returns to its original position visually (no visible change). No error message shown. |
| Invariant | Board state after the event is byte-for-byte identical to the state before drag started. |

---

#### Scenario C: Drop on Non-Task, Non-Column Area

| Field | Definition |
|-------|-----------|
| Description | User releases drag over a UI element that is not a registered drop zone (e.g., toolbar, modal, card action button) |
| Detection | DnD event fires with no valid column target (same as Scenario A). |
| Rollback | No store mutation. Task retains its original `columnId` and `position`. Drag context cleared. |
| Feedback | Column highlight removed. Card snaps/animates back to original position. No error message shown. |
| Invariant | Board state after the event is byte-for-byte identical to the state before drag started. |

---

### Verification Criteria for Invalid-Drop Rollback

A test or QA reviewer MUST confirm all of the following after any invalid drop event:

1. **Task position unchanged:** `task.position === originalPosition` where `originalPosition` was captured before drag started.
2. **Task column unchanged:** `task.columnId === originalColumnId` where `originalColumnId` was captured before drag started.
3. **No duplicate tasks:** The total task count across all columns equals the count before drag started.
4. **No missing tasks:** The task that was dragged is still present in the source column at the correct position.
5. **No position gaps:** After the event, each column's task array has a contiguous 0-indexed position sequence.
6. **No visual highlight persists:** The column highlight (droppable indicator) is not visible on any column.
7. **No drag state persists:** The dragged card does not retain dragging-state styling (opacity, ghost, etc.).
