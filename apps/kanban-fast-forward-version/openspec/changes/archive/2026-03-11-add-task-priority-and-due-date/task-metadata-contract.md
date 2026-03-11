# Task Metadata Contract

> **Spec reference:** `openspec/changes/add-task-priority-and-due-date/specs/task-priority-and-due-date/spec.md`
>
> **Resolved open questions:**
> - Due date format: YYYY-MM-DD date-only string (NOT a full timestamp).
> - Overdue visual state: OUT OF SCOPE — deferred to a follow-up spec.

---

## 1.1 Task Model Extension — `priority` Field

**Requirement: Task priority catalog**

The task entity SHALL include a `priority` field constrained to exactly three allowed string values: `low`, `medium`, and `high`. No other value is permitted.

### Field definition

| Field      | Type   | Required | Allowed values          | Default (backward compat) |
|------------|--------|----------|-------------------------|---------------------------|
| `priority` | string | yes      | `low`, `medium`, `high` | `"medium"` — applied to tasks loaded from localStorage that lack a priority field |

### Behavioral rules

- When a user creates or edits a task, they MUST supply one of the three allowed priority values.
- The system MUST store the supplied value on the task record verbatim.
- Any value outside `low|medium|high` MUST be rejected before the task record is written.
- On application load, if an existing task record in localStorage has no `priority` field, the system MUST default that task's priority to `"medium"` in memory (a safe, non-alarming default).
- `priority` is stored as part of the task object in localStorage alongside `id`, `title`, `description`, `position`, and `columnId`.

### Scenarios covered

**Scenario: Set valid priority on task creation**
- WHEN the user creates a task and selects `low`, `medium`, or `high`
- THEN the system stores the selected priority on the task.

**Scenario: Reject invalid priority value**
- WHEN a task is submitted with a priority value outside `low|medium|high`
- THEN the system rejects the operation with a clear validation error.

### Data-testids

- `task-priority-select` — the form control used to select task priority.
- `task-priority-error` — the element that surfaces the priority validation error message.

---

## 1.2 Task Model Extension — `dueDate` Field

**Requirement: Optional due date metadata**

The task entity SHALL include an optional `dueDate` field. The field MAY be absent or set to a valid date-only string.

### Field definition

| Field     | Type               | Required | Format     | Default  |
|-----------|--------------------|----------|------------|----------|
| `dueDate` | string \| undefined | no      | YYYY-MM-DD | absent (undefined — omitted from the stored object) |

### Behavioral rules

- `dueDate` is optional: a task MAY be created or saved without a due date.
- When provided, the value MUST conform to the `YYYY-MM-DD` date-only format (no time component, no timezone).
- The field MUST be updatable (set, changed, or cleared) on an existing task through the edit flow.
- Clearing the field (leaving it empty) sets `dueDate` to `undefined`, which removes it from the persisted task object.
- When `dueDate` is `undefined`, it MUST be omitted from the localStorage record — not stored as `null`, `""`, or any sentinel.
- The system MUST persist and restore the exact string value stored (no coercion to timestamps or other formats).

### Scenarios covered

**Scenario: Create task with due date**
- WHEN the user creates a task with a valid due date
- THEN the system stores the due date on the task.

**Scenario: Edit due date on existing task**
- WHEN the user updates an existing task due date
- THEN the system persists the new due date value.

### Data-testids

- `task-due-date-input` — the form input used to enter or edit the due date.
- `task-due-date-error` — the element that surfaces the due date validation error message.

---

## 1.3 Task Create/Edit Form Inputs

**Requirement: Task priority catalog / Optional due date metadata**

The task create and edit forms SHALL expose dedicated inputs for `priority` and `dueDate` that are bound to the task entity fields defined in §1.1 and §1.2.

### Priority input (create form)

- The form MUST present a discrete selection control offering exactly three options: `Low`, `Medium`, `High`.
- The default selected option in the create form MUST be `Medium`.
- `data-testid="task-priority-select"` MUST be present on this control.

### Priority input (edit form)

- The control MUST be pre-filled with the task's current `priority` value.
- Changing the selection and saving MUST update `priority` on the task record.

### Due date input (create form)

- The form MUST present a date input that accepts values in `YYYY-MM-DD` format.
- The input MUST default to empty (no date preselected).
- Leaving it empty and submitting does NOT produce a due date error.
- `data-testid="task-due-date-input"` MUST be present on this control.

### Due date input (edit form)

- The input MUST be pre-filled with the task's current `dueDate` if set, or left empty if `undefined`.
- Clearing the input and saving MUST result in `dueDate` being removed from the task record (set to `undefined`).
- An invalid date value submitted through this control MUST trigger the date validation error described in §2.1.

### Both inputs appear alongside the existing title and description fields.

### Data-testids

| Control              | data-testid            |
|----------------------|------------------------|
| Priority selector    | `task-priority-select` |
| Priority error       | `task-priority-error`  |
| Due date input       | `task-due-date-input`  |
| Due date error       | `task-due-date-error`  |

---

## 2.1 Validation — Invalid Due Date Input

**Requirement: Due date validation behavior**

The system SHALL reject any non-empty `dueDate` value that does not resolve to a valid `YYYY-MM-DD` calendar date, and SHALL present a deterministic validation message.

### Invalid date scenarios

| Case | Example input | Outcome |
|------|--------------|---------|
| Non-date string | `"abc"`, `"tomorrow"` | rejected |
| Wrong separator / format | `"13/32/2024"`, `"2024/06/01"` | rejected |
| Incomplete date | `"2024-"`, `"2024-13"` | rejected |
| Empty / cleared | `""` | **valid** — `dueDate` becomes `undefined` |

### Behavioral rules

- Validation MUST occur before any state write or persistence operation.
- An empty or cleared date input is NOT an error — it sets `dueDate` to `undefined`.
- The error message MUST be deterministic: `"Due date must be a valid date (YYYY-MM-DD)."`
- The task record MUST NOT be written while an invalid date is present.
- The error MUST clear when the user corrects the input to a valid `YYYY-MM-DD` value or clears it.

### Error surface

- The validation message MUST be rendered at `data-testid="task-due-date-error"`.

### Scenario covered

**Scenario: Reject invalid date format**
- WHEN the user submits an invalid date value for `dueDate`
- THEN the system blocks the update and displays: `"Due date must be a valid date (YYYY-MM-DD)."`

---

## 2.2 Validation — Invalid Priority Value

**Requirement: Task priority catalog**

The system SHALL reject any `priority` value that is not one of `low`, `medium`, or `high` (lowercase, exact match) and SHALL present a deterministic validation error.

### Behavioral rules

- Valid values: exactly `"low"`, `"medium"`, `"high"` (lowercase, verbatim).
- Invalid: any other string, empty string, or missing value.
- The UI MUST constrain choices via a select/dropdown — a user cannot type an arbitrary value, making UI-level invalid priority an edge case.
- As a defensive guard, if a task is programmatically submitted with an invalid priority (e.g., via a direct store call), the operation MUST be rejected.
- The error message MUST be deterministic: `"Priority must be one of: low, medium, high."`
- Submission MUST be blocked until a valid value is provided.
- The error MUST clear once a valid priority is selected.

### Error surface

- The validation message MUST be rendered at `data-testid="task-priority-error"`.

### Scenario covered

**Scenario: Reject invalid priority value**
- WHEN a task is submitted with a priority value outside `low|medium|high`
- THEN the system rejects the operation with the message: `"Priority must be one of: low, medium, high."`

---

## 2.3 Task Card Metadata Display

**Requirement: Task card metadata display**

Each task card SHALL display the task's `priority` always (it is a required field) and `dueDate` when present, in a legible and consistent format. Both metadata values MUST appear below the task title, compact and non-intrusive.

### Priority badge

- `task-priority-badge` MUST always be rendered on the task card (priority is required on every task).
- The badge MUST display the stored priority value in a human-readable label: `Low`, `Medium`, or `High`.
- The badge text MUST match the stored priority value exactly (case-normalized to title case for display is acceptable).

### Due date display

- `task-due-date-display` MUST be rendered only when `dueDate` is set on the task.
- The displayed value MUST be a human-readable date string derived from the stored `YYYY-MM-DD` value (e.g., `"Mar 15, 2026"`).
- The stored `YYYY-MM-DD` string MUST NOT be altered; the display is a formatted representation.
- If `dueDate` is absent, `task-due-date-display` MUST NOT be rendered — no empty placeholder.
- Overdue visual state (color change, icon) is OUT OF SCOPE for this change.

### Data-testids

| Element             | data-testid              | Visibility condition         |
|---------------------|--------------------------|------------------------------|
| Priority badge      | `task-priority-badge`    | Always (priority is required)|
| Due date display    | `task-due-date-display`  | Only when `dueDate` is set   |

### Scenario covered

**Scenario: Render priority and due date in card**
- WHEN a task has priority and/or due date metadata
- THEN the task card displays those values in a readable format.

---

## 3.1 Local-First Metadata Persistence

**Requirement: Local-first metadata persistence**

The system SHALL persist the `priority` and `dueDate` fields as part of each task record in local-first storage, and SHALL restore those fields exactly after a page reload or application reopen.

### Behavioral rules

- `priority` is always persisted as part of the task object (it is a required field).
- `dueDate` is persisted when set; it MUST be omitted from the object when `undefined`.
- Both fields are written to localStorage as part of the same `saveState()` call as the rest of the task.
- On application load, each task's `priority` and `dueDate` MUST be read from the stored record and restored to the in-memory state without transformation.
- The restored values MUST be byte-for-byte identical to the values that were written (no coercion, no reformatting).
- If a task has no `dueDate` in storage, the field MUST remain `undefined` after restore — it MUST NOT be defaulted to any other value.
- Backward compatibility: tasks loaded from localStorage without a `priority` field MUST default to `"medium"` in memory.

### Scenario covered

**Scenario: Restore metadata after reload**
- WHEN the user reloads or reopens the application
- THEN task priority and due date values are restored exactly from local storage.
