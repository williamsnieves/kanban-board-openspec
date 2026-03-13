## Purpose

TBD — This spec captures requirements for board column management, including creating, renaming, and deleting columns.

## Requirements

### Requirement: Create custom column
The board MUST allow users to create a new non-default column with a valid unique name.

#### Scenario: Create column with valid unique name
- **GIVEN** an existing board with columns `Todo`, `Doing`, and `Done`
- **WHEN** the user creates a column named `Review`
- **THEN** a new column `Review` is added to the board
- **AND** the column is persisted in mock-backed state

#### Scenario: Reject empty column name on create
- **GIVEN** an existing board
- **WHEN** the user attempts to create a column with name `""` or `"   "`
- **THEN** the column is not created
- **AND** validation feedback is shown in UI

#### Scenario: Reject duplicate column name on create (case-insensitive)
- **GIVEN** an existing board containing column `Review`
- **WHEN** the user attempts to create a column named `review`
- **THEN** the column is not created
- **AND** duplicate-name validation feedback is shown

### Requirement: Rename custom column
The board MUST allow renaming an existing column to a valid unique name.

#### Scenario: Rename column with valid unique name
- **GIVEN** an existing custom column `Backlog`
- **WHEN** the user renames it to `Ready`
- **THEN** the column name is updated to `Ready`
- **AND** the updated name is persisted in mock-backed state

#### Scenario: Reject invalid rename with empty value
- **GIVEN** an existing column `Backlog`
- **WHEN** the user renames it to whitespace-only text
- **THEN** the rename is rejected
- **AND** the original name remains unchanged

#### Scenario: Reject duplicate rename (case-insensitive)
- **GIVEN** columns `Backlog` and `Review`
- **WHEN** `Backlog` is renamed to `review`
- **THEN** the rename is rejected
- **AND** both original names remain unchanged

### Requirement: Delete only empty columns
The board MUST allow deleting a column only when it has no cards.

#### Scenario: Delete an empty custom column
- **GIVEN** an empty custom column `Blocked`
- **WHEN** the user requests column deletion
- **THEN** `Blocked` is removed from the board
- **AND** the resulting state is persisted in mock-backed storage

#### Scenario: Prevent deleting a non-empty custom column
- **GIVEN** a custom column `Blocked` containing at least one card
- **WHEN** the user requests column deletion
- **THEN** deletion is blocked
- **AND** the column remains in the board

### Requirement: Protect default columns from deletion
The board MUST prevent deletion of default columns `Todo`, `Doing`, and `Done`.

#### Scenario: Attempt to delete protected default column
- **GIVEN** an existing default column `Todo`
- **WHEN** the user requests deletion of `Todo`
- **THEN** deletion is blocked
- **AND** `Todo` remains in the board

### Requirement: Reorder excluded from this change
Manual column reorder MUST remain out of scope for this change.

#### Scenario: Scope validation for column management MVP
- **GIVEN** this change definition
- **WHEN** artifacts are reviewed
- **THEN** manual column reordering is explicitly excluded from requirements
