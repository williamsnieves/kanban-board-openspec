## MODIFIED Requirements

### Requirement: Task priority catalog

The system SHALL support task priority values limited to `low`, `medium`, and `high`. Apply artifacts SHALL include explicit traceability and failing→passing evidence for valid and invalid priority scenarios.

#### Scenario: Set valid priority on task creation

- **WHEN** the user creates a task and selects `low`, `medium`, or `high`
- **THEN** the system stores the selected priority on the task, with scenario-linked test evidence captured

#### Scenario: Reject invalid priority value

- **WHEN** a task is submitted with a priority value outside `low|medium|high`
- **THEN** the system rejects the operation with a clear validation error, with scenario-linked test evidence captured

### Requirement: Optional due date metadata

The system SHALL allow an optional `dueDate` field on tasks during create and edit operations. Apply artifacts SHALL include explicit verification for set/update/clear behavior.

#### Scenario: Create task with due date

- **WHEN** the user creates a task with a valid due date
- **THEN** the system stores the due date on the task, with scenario-linked test evidence captured

#### Scenario: Edit due date on existing task

- **WHEN** the user updates an existing task due date
- **THEN** the system persists the new due date value, with scenario-linked test evidence captured

### Requirement: Due date validation behavior

The system SHALL reject invalid due date inputs and present deterministic validation feedback. Apply artifacts SHALL capture blocked-write proof and deterministic message verification.

#### Scenario: Reject invalid date format

- **WHEN** the user submits an invalid date value for `dueDate`
- **THEN** the system blocks the update and displays a clear validation message, with scenario-linked test evidence captured

### Requirement: Task card metadata display

The system SHALL display task priority and due date in each task card using a legible and consistent format. Apply artifacts SHALL include display/absence checks and card stability checks.

#### Scenario: Render priority and due date in card

- **WHEN** a task has priority and/or due date metadata
- **THEN** the task card displays those values in a readable format, with scenario-linked test evidence captured

### Requirement: Local-first metadata persistence

The system SHALL persist and restore `priority` and `dueDate` fields through local-first storage across refresh and reopen. Apply artifacts SHALL include exact-restore evidence.

#### Scenario: Restore metadata after reload

- **WHEN** the user reloads or reopens the application
- **THEN** task priority and due date values are restored exactly from local storage, with scenario-linked test evidence captured

### Requirement: Explicit out-of-scope constraints

The system SHALL exclude reminders, notifications, advanced filtering, and backend API integration from this change scope. Apply artifacts SHALL include scope-boundary verification.

#### Scenario: Scope boundary enforcement

- **WHEN** evaluating implementation and acceptance for this change
- **THEN** only priority and due date metadata behavior is considered in scope, with reviewer boundary checks recorded
