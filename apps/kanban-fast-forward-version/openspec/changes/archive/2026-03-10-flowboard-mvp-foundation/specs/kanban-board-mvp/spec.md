## ADDED Requirements

### Requirement: Board creation and access

The system SHALL allow users to create a board with a required name, list existing boards, and open a selected board.

#### Scenario: Create board with valid name

- **WHEN** the user submits a non-empty board name
- **THEN** the system creates the board and shows it in the board list

#### Scenario: Reject empty board name

- **WHEN** the user submits an empty board name
- **THEN** the system rejects the submission and shows a clear validation message

### Requirement: Default board workflow columns

The system SHALL initialize every newly created board with exactly three default columns named Todo, Doing, and Done, preserving deterministic left-to-right order.

#### Scenario: Create board initializes default columns

- **WHEN** a new board is created
- **THEN** the board includes Todo, Doing, and Done columns in that order

### Requirement: Task lifecycle management

The system SHALL support task creation, editing, and deletion within a board, requiring a non-empty task title.

#### Scenario: Create task with required title

- **WHEN** the user submits a task with a non-empty title
- **THEN** the system creates the task in the selected column

#### Scenario: Edit task fields

- **WHEN** the user updates task title or description and saves
- **THEN** the system persists and displays the updated task data

#### Scenario: Delete task

- **WHEN** the user confirms task deletion
- **THEN** the system removes the task from the board

### Requirement: Task ordering and movement

The system SHALL allow users to reorder tasks within a column and move tasks between columns while preserving deterministic ordering after each action.

#### Scenario: Reorder task within the same column

- **WHEN** the user reorders tasks inside one column
- **THEN** the system updates positions and renders tasks in the new order

#### Scenario: Move task to another column

- **WHEN** the user moves a task from one column to another
- **THEN** the system updates column assignment and inserts the task at a deterministic position

### Requirement: Local-first persistence

The system SHALL persist boards, columns, tasks, and task ordering in browser local storage so data survives page refresh and reopen.

#### Scenario: Data survives refresh

- **WHEN** the user refreshes or reopens the application
- **THEN** previously saved boards and tasks are restored from local storage

### Requirement: Deterministic validation feedback

The system SHALL provide clear and consistent validation feedback for missing required fields and prevent invalid state writes.

#### Scenario: Invalid task title

- **WHEN** the user submits a task with an empty title
- **THEN** the system blocks creation and displays a deterministic error message
