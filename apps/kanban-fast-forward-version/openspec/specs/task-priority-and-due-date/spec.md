## MODIFIED Requirements

### Requirement: Task priority catalog

The system SHALL support task priority values limited to `low`, `medium`, and `high`.

#### Scenario: Set valid priority on task creation

- **WHEN** the user creates a task and selects `low`, `medium`, or `high`
- **THEN** the system stores the selected priority on the task

#### Scenario: Reject invalid priority value

- **WHEN** a task is submitted with a priority value outside `low|medium|high`
- **THEN** the system rejects the operation with a clear validation error ("Priority must be one of: low, medium, high.")

### Requirement: Optional due date metadata

The system SHALL allow an optional `dueDate` field on tasks during create and edit operations.

#### Scenario: Create task with due date

- **WHEN** the user creates a task with a valid due date
- **THEN** the system stores the due date on the task

#### Scenario: Edit due date on existing task

- **WHEN** the user updates an existing task due date
- **THEN** the system persists the new due date value

### Requirement: Due date validation behavior

The system SHALL reject invalid due date inputs and present deterministic validation feedback.

#### Scenario: Reject invalid date format

- **WHEN** the user submits an invalid date value for `dueDate`
- **THEN** the system blocks the update and displays: "Due date must be a valid date (YYYY-MM-DD)."

### Requirement: Task card metadata display

The system SHALL display task priority and due date in each task card using a legible and consistent format.

#### Scenario: Render priority and due date in card

- **WHEN** a task has priority and/or due date metadata
- **THEN** the task card displays priority badge always and due date only when set, in human-readable format

### Requirement: Local-first metadata persistence

The system SHALL persist and restore `priority` and `dueDate` fields through local-first storage across refresh and reopen. Legacy tasks without `priority` SHALL default to `"medium"` in memory.

#### Scenario: Restore metadata after reload

- **WHEN** the user reloads or reopens the application
- **THEN** task priority and due date values are restored exactly from local storage

### Requirement: Explicit out-of-scope constraints

The system SHALL exclude reminders, notifications, advanced filtering, and backend API integration from this change scope.

#### Scenario: Scope boundary enforcement

- **WHEN** evaluating implementation and acceptance for this change
- **THEN** only priority and due date metadata behavior is considered in scope
