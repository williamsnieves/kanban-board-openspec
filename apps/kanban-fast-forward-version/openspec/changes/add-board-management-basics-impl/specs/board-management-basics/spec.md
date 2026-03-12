## MODIFIED Requirements

### Requirement: Board rename with deterministic validation

The system SHALL allow users to rename an existing board when the new name is non-empty and SHALL reject invalid names with clear feedback.

#### Scenario: Rename board with valid name

- **WHEN** the user submits a non-empty new board name
- **THEN** the system updates the board name and reflects it in all board selection views

#### Scenario: Reject empty rename

- **WHEN** the user submits an empty board name during rename
- **THEN** the system prevents the update and displays a deterministic validation message

### Requirement: Board delete with confirmation

The system SHALL require explicit confirmation before deleting a board and SHALL remove its related columns and tasks from persisted state.

#### Scenario: Confirm board deletion

- **WHEN** the user confirms deletion of a board
- **THEN** the system deletes the board and its associated data from local persistence

#### Scenario: Cancel board deletion

- **WHEN** the user cancels deletion
- **THEN** the system keeps the board unchanged

### Requirement: Local-first persistence for board management

The system SHALL persist board rename and delete outcomes in local storage so state remains consistent after refresh or reopen.

#### Scenario: Persist rename and delete actions

- **WHEN** the user renames or deletes a board
- **THEN** the resulting state is restored correctly after page refresh or app reopen
