# Acceptance Checklist — Task DnD Interaction

> Source spec: `openspec/changes/add-task-dnd-interaction/specs/task-dnd-interaction/spec.md`
> Contract: `openspec/changes/add-task-dnd-interaction/dnd-interaction-contract.md`

---

## Section 3.0 — Drag State Scenario Checks

### Drag Start (Draggable Task Interaction)

**Spec requirement:** Draggable task interaction
**Spec scenario:** Start dragging a task

- [ ] When a task card drag is initiated, the card displays a visible dragging state (e.g., reduced opacity, outline, or ghost image applied).
- [ ] All registered drop-target columns become active/ready to receive the dragged card during the drag.
- [ ] The dragging state is present for the entire duration of the drag operation (not only at start).

---

## Section 3.1 — Movement Scenario Checks

### Same-Column Reorder

**Spec requirement:** Deterministic drop and reorder behavior
**Spec scenario:** Drop within same column

- [ ] Task moved to new position appears at correct visual index in the column.
- [ ] All other tasks in the column have updated, normalized positions (0-indexed, no gaps).
- [ ] No task is lost after reorder (total task count in column is unchanged).
- [ ] No task is duplicated after reorder (each `taskId` appears exactly once in the column).
- [ ] Position sequence is a contiguous 0-indexed integer sequence (0, 1, 2, … n-1).
- [ ] The reordered task's `position` value in the store equals the drop target index.

---

### Cross-Column Move

**Spec requirement:** Deterministic drop and reorder behavior
**Spec scenario:** Drop across columns

- [ ] Task no longer appears in the source column after the move.
- [ ] Task appears in the target column at the end position (`position = target.tasks.length - 1` after normalization).
- [ ] Source column positions are normalized after removal (contiguous 0-indexed, no gaps).
- [ ] Target column positions are normalized after insertion (contiguous 0-indexed, no gaps).
- [ ] `task.columnId` is updated to the target column's id in the store.
- [ ] No task is lost across all columns (total board task count is unchanged).
- [ ] No task is duplicated across all columns (each `taskId` appears in exactly one column).

---

## Section 3.2 — Feedback Scenario Checks

### Valid Drop Target Highlight

**Spec requirement:** Valid and invalid drop feedback
**Spec scenario:** Valid drop target highlight

- [ ] When a task card is dragged over a valid column, that column displays a visible highlight (e.g., colored border or background tint change).
- [ ] The highlight is applied only to the column currently under the drag pointer (not all columns simultaneously).
- [ ] The highlight is removed when the dragged task leaves the column area.
- [ ] The highlight does not persist after the task is dropped (successful drop clears highlight).
- [ ] The highlight does not persist after drag is cancelled (invalid drop or escape clears highlight).

---

### Invalid Drop Cancel

**Spec requirement:** Valid and invalid drop feedback
**Spec scenario:** Invalid drop attempt

- [ ] When a task is released over an invalid target (outside any column), it returns to its original column and position.
- [ ] Board state (all task `position` values and `columnId` values) is identical to the pre-drag state.
- [ ] No visual drag-state styling remains on the task card after cancel (opacity, ghost, outline, etc.).
- [ ] No column highlight is visible on any column after cancel.
- [ ] No error message or alert is shown to the user (silent cancel is acceptable per spec).

---

## Section 3.3 — Keyboard Fallback Scenario Checks

### Keyboard-Accessible Movement Fallback

**Spec requirement:** Keyboard-accessible movement fallback
**Spec scenario:** Move task with keyboard fallback

- [ ] `ArrowUp` on a focused task moves it up one position in its column (same state outcome as `reorderTask` with `newPosition = currentPosition - 1`).
- [ ] `ArrowDown` on a focused task moves it down one position in its column (same state outcome as `reorderTask` with `newPosition = currentPosition + 1`).
- [ ] `ArrowLeft` on a focused task moves it to the previous column at the end position (same state outcome as `moveTask` to previous column).
- [ ] `ArrowRight` on a focused task moves it to the next column at the end position (same state outcome as `moveTask` to next column).
- [ ] `ArrowUp` when task is at position 0: no action taken, no error shown.
- [ ] `ArrowDown` when task is at the last position in its column: no action taken, no error shown.
- [ ] `ArrowLeft` when task is in the leftmost column: no action taken, no error shown.
- [ ] `ArrowRight` when task is in the rightmost column: no action taken, no error shown.
- [ ] After each successful keyboard move, focus follows the task card to its new position.
- [ ] Resulting task positions and `columnId` are identical to what DnD drop would produce for the equivalent operation.

---

## Traceability Table

| Acceptance Check | Spec Requirement | Spec Scenario |
|------------------|-----------------|---------------|
| Dragged card shows visible dragging state during drag | Draggable task interaction | Start dragging a task |
| All drop-target columns become active during drag | Draggable task interaction | Start dragging a task |
| Dragging state persists for entire drag duration | Draggable task interaction | Start dragging a task |
| Task at correct visual index after reorder | Deterministic drop and reorder behavior | Drop within same column |
| All tasks have normalized positions after reorder | Deterministic drop and reorder behavior | Drop within same column |
| No task lost after reorder | Deterministic drop and reorder behavior | Drop within same column |
| No task duplicated after reorder | Deterministic drop and reorder behavior | Drop within same column |
| Position sequence is contiguous 0-indexed after reorder | Deterministic drop and reorder behavior | Drop within same column |
| Reordered task.position equals drop target index | Deterministic drop and reorder behavior | Drop within same column |
| Task absent from source column after cross-column move | Deterministic drop and reorder behavior | Drop across columns |
| Task present at end of target column after cross-column move | Deterministic drop and reorder behavior | Drop across columns |
| Source column positions normalized after cross-column move | Deterministic drop and reorder behavior | Drop across columns |
| Target column positions normalized after cross-column move | Deterministic drop and reorder behavior | Drop across columns |
| task.columnId updated to target after cross-column move | Deterministic drop and reorder behavior | Drop across columns |
| No task lost across board after cross-column move | Deterministic drop and reorder behavior | Drop across columns |
| No task duplicated across board after cross-column move | Deterministic drop and reorder behavior | Drop across columns |
| Column shows visible highlight when dragged over | Valid and invalid drop feedback | Valid drop target highlight |
| Highlight on active column only | Valid and invalid drop feedback | Valid drop target highlight |
| Highlight removed when task leaves column | Valid and invalid drop feedback | Valid drop target highlight |
| Highlight clears after successful drop | Valid and invalid drop feedback | Valid drop target highlight |
| Highlight clears after cancel | Valid and invalid drop feedback | Valid drop target highlight |
| Task returns to original position on invalid drop | Valid and invalid drop feedback | Invalid drop attempt |
| Board state identical to pre-drag state after invalid drop | Valid and invalid drop feedback | Invalid drop attempt |
| No drag styling persists after cancel | Valid and invalid drop feedback | Invalid drop attempt |
| No column highlight persists after cancel | Valid and invalid drop feedback | Invalid drop attempt |
| No error message shown on cancel | Valid and invalid drop feedback | Invalid drop attempt |
| ArrowUp moves task up one position in column | Keyboard-accessible movement fallback | Move task with keyboard fallback |
| ArrowDown moves task down one position in column | Keyboard-accessible movement fallback | Move task with keyboard fallback |
| ArrowLeft moves task to previous column at end | Keyboard-accessible movement fallback | Move task with keyboard fallback |
| ArrowRight moves task to next column at end | Keyboard-accessible movement fallback | Move task with keyboard fallback |
| ArrowUp at position 0: no-op, no error | Keyboard-accessible movement fallback | Move task with keyboard fallback |
| ArrowDown at last position: no-op, no error | Keyboard-accessible movement fallback | Move task with keyboard fallback |
| ArrowLeft in leftmost column: no-op, no error | Keyboard-accessible movement fallback | Move task with keyboard fallback |
| ArrowRight in rightmost column: no-op, no error | Keyboard-accessible movement fallback | Move task with keyboard fallback |
| Focus follows task after keyboard move | Keyboard-accessible movement fallback | Move task with keyboard fallback |
| Keyboard move result is identical to equivalent DnD drop | Keyboard-accessible movement fallback | Move task with keyboard fallback |
