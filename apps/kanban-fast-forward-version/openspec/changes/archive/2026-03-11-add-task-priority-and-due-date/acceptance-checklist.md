# Acceptance Checklist — Task Priority and Due Date

> Source spec: `openspec/changes/add-task-priority-and-due-date/specs/task-priority-and-due-date/spec.md`
> Contract: `openspec/changes/add-task-priority-and-due-date/task-metadata-contract.md`

---

## Section 1 — Priority Scenario Checks

### Set Valid Priority on Task Creation

**Spec requirement:** Task priority catalog
**Spec scenario:** Set valid priority on task creation

- [ ] The task create form renders a priority selector (`data-testid="task-priority-select"`) with exactly three options: `low`, `medium`, `high`.
- [ ] The priority selector defaults to `medium` in the task create form.
- [ ] Selecting `low` and submitting the form stores `priority: "low"` on the task record.
- [ ] Selecting `medium` and submitting the form stores `priority: "medium"` on the task record.
- [ ] Selecting `high` and submitting the form stores `priority: "high"` on the task record.
- [ ] The stored priority value is retrievable from local storage immediately after task creation.

---

### Reject Invalid Priority Value

**Spec requirement:** Task priority catalog
**Spec scenario:** Reject invalid priority value

- [ ] Submitting a task with a priority value outside `low|medium|high` does NOT write to the task store.
- [ ] The priority error element (`data-testid="task-priority-error"`) becomes visible with the message: `"Priority must be one of: low, medium, high."`
- [ ] The validation message is deterministic (same text for the same class of invalid input).
- [ ] The error element is NOT visible when a valid priority is selected.

---

## Section 2 — Due Date Scenario Checks

### Create Task with Due Date

**Spec requirement:** Optional due date metadata
**Spec scenario:** Create task with due date

- [ ] The task create form renders a due date input (`data-testid="task-due-date-input"`).
- [ ] Submitting a task with a valid `YYYY-MM-DD` due date stores the value on the task record verbatim.
- [ ] The stored `dueDate` value is retrievable from local storage immediately after task creation.
- [ ] Submitting a task without a due date stores `dueDate` as `undefined` (absent from the task object — not `null`, not `""`); no error is raised.

---

### Edit Due Date on Existing Task

**Spec requirement:** Optional due date metadata
**Spec scenario:** Edit due date on existing task

- [ ] The task edit form pre-populates the due date input (`data-testid="task-due-date-input"`) with the stored value.
- [ ] Updating the due date to a new valid `YYYY-MM-DD` value and saving persists the new value in the task record.
- [ ] Clearing the due date field and saving stores `dueDate` as `undefined` (absent from the task object — not `null`, not `""`).
- [ ] The updated value is reflected in local storage immediately after save.

---

## Section 3 — Validation Scenario Checks

### Reject Invalid Date Format

**Spec requirement:** Due date validation behavior
**Spec scenario:** Reject invalid date format

- [ ] Submitting a task with a `dueDate` value not matching `YYYY-MM-DD` (e.g., `"03/15/2026"`, `"next week"`) does NOT write to the task store.
- [ ] The due date error element (`data-testid="task-due-date-error"`) becomes visible with the message: `"Due date must be a valid date (YYYY-MM-DD)."`
- [ ] The validation message is deterministic (same text for the same class of invalid input).
- [ ] The error element is NOT visible when the due date input is empty (optional field).
- [ ] The error element is NOT visible when the due date input contains a valid `YYYY-MM-DD` value.

---

## Section 4 — Card Display Scenario Checks

### Render Priority and Due Date in Card

**Spec requirement:** Task card metadata display
**Spec scenario:** Render priority and due date in card

- [ ] A task card with a `priority` value renders a priority badge (`data-testid="task-priority-badge"`) showing the priority label.
- [ ] The priority badge is visible for all three priority values: `low`, `medium`, and `high`.
- [ ] A task card with a `dueDate` value renders a due date display element (`data-testid="task-due-date-display"`) showing the date.
- [ ] The displayed date is derived from the stored `YYYY-MM-DD` value (exact string or human-readable equivalent).
- [ ] A task card with no `dueDate` (undefined/absent) does NOT render the due date display element (`data-testid="task-due-date-display"` is absent).
- [ ] Neither field overflows or breaks the card layout.

---

## Section 5 — Persistence Scenario Checks

### Restore Metadata after Reload

**Spec requirement:** Local-first metadata persistence
**Spec scenario:** Restore metadata after reload

- [ ] After a page reload, each task's `priority` value is restored exactly from local storage (byte-for-byte).
- [ ] After a page reload, each task's `dueDate` value is restored exactly from local storage (byte-for-byte).
- [ ] A task with no `dueDate` set still has `dueDate` as `undefined` (absent) after reload — no default is substituted.
- [ ] Task cards reflect the restored `priority` and `dueDate` values immediately on load without a manual refresh action.

---

## Section 6 — Scope Boundary Enforcement Checks

### Scope Boundary Enforcement

**Spec requirement:** Explicit out-of-scope constraints
**Spec scenario:** Scope boundary enforcement

- [ ] No reminder or notification mechanism is implemented in this change.
- [ ] No advanced filtering or sorting by priority or due date is implemented in this change.
- [ ] No backend API calls or server-side persistence are introduced by this change.
- [ ] No overdue visual state (color, icon, alert) is rendered on task cards in this change.
- [ ] The only new behavior in this change is: priority field, due date field, related validation, card display, and local-first persistence.

---

## Traceability Table

| Acceptance Check | Spec Requirement | Spec Scenario |
|------------------|-----------------|---------------|
| Priority selector renders with low/medium/high options | Task priority catalog | Set valid priority on task creation |
| Priority selector defaults to `medium` in create form | Task priority catalog | Set valid priority on task creation |
| Selecting `low` stores `priority: "low"` | Task priority catalog | Set valid priority on task creation |
| Selecting `medium` stores `priority: "medium"` | Task priority catalog | Set valid priority on task creation |
| Selecting `high` stores `priority: "high"` | Task priority catalog | Set valid priority on task creation |
| Stored priority is readable from local storage | Task priority catalog | Set valid priority on task creation |
| Invalid priority blocks store write | Task priority catalog | Reject invalid priority value |
| Priority error element shows exact message: "Priority must be one of: low, medium, high." | Task priority catalog | Reject invalid priority value |
| Priority error message is deterministic | Task priority catalog | Reject invalid priority value |
| Priority error not visible when valid value selected | Task priority catalog | Reject invalid priority value |
| Due date input is rendered on create form | Optional due date metadata | Create task with due date |
| Valid YYYY-MM-DD due date stored verbatim | Optional due date metadata | Create task with due date |
| Stored due date readable from local storage after create | Optional due date metadata | Create task with due date |
| Empty due date stored as undefined (absent) without error | Optional due date metadata | Create task with due date |
| Edit form pre-populates due date input | Optional due date metadata | Edit due date on existing task |
| Updated due date persisted after save | Optional due date metadata | Edit due date on existing task |
| Cleared due date stored as undefined (absent) after save | Optional due date metadata | Edit due date on existing task |
| Updated value reflected in local storage | Optional due date metadata | Edit due date on existing task |
| Invalid date format blocks store write | Due date validation behavior | Reject invalid date format |
| Due date error element shows exact message: "Due date must be a valid date (YYYY-MM-DD)." | Due date validation behavior | Reject invalid date format |
| Due date error message is deterministic | Due date validation behavior | Reject invalid date format |
| Due date error not visible when field is empty | Due date validation behavior | Reject invalid date format |
| Due date error not visible when valid YYYY-MM-DD entered | Due date validation behavior | Reject invalid date format |
| Priority badge rendered for all three priority values | Task card metadata display | Render priority and due date in card |
| Due date display rendered when dueDate is set (not undefined/absent) | Task card metadata display | Render priority and due date in card |
| Displayed date derived from stored YYYY-MM-DD value | Task card metadata display | Render priority and due date in card |
| Due date display absent when dueDate is undefined (absent) | Task card metadata display | Render priority and due date in card |
| Card layout not broken by metadata fields | Task card metadata display | Render priority and due date in card |
| priority restored exactly after reload | Local-first metadata persistence | Restore metadata after reload |
| dueDate restored exactly after reload | Local-first metadata persistence | Restore metadata after reload |
| absent dueDate remains undefined after reload (no default substituted) | Local-first metadata persistence | Restore metadata after reload |
| Cards reflect restored values immediately on load | Local-first metadata persistence | Restore metadata after reload |
| No reminder/notification mechanism implemented | Explicit out-of-scope constraints | Scope boundary enforcement |
| No advanced filtering or sorting by priority/due date | Explicit out-of-scope constraints | Scope boundary enforcement |
| No backend API calls introduced | Explicit out-of-scope constraints | Scope boundary enforcement |
| No overdue visual state on task cards | Explicit out-of-scope constraints | Scope boundary enforcement |
| Only in-scope behavior added (priority, due date, validation, display, persistence) | Explicit out-of-scope constraints | Scope boundary enforcement |
