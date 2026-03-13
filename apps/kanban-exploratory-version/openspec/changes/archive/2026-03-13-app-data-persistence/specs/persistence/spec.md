## ADDED Requirements

### Requirement: Persist Application State
The application MUST save the current state (boards, columns, tasks) to the browser's `localStorage` whenever a change occurs.

#### Scenario: Save state on change
- **GIVEN** the application is running
- **WHEN** the user creates a new board, column, or task
- **THEN** the updated state is serialized and written to `localStorage`
- **AND** the data is stored under a consistent key (e.g., `flowboard-state`)

### Requirement: Hydrate State on Startup
The application MUST load and restore the saved state from `localStorage` when the application starts or reloads.

#### Scenario: Restore saved state
- **GIVEN** a valid application state exists in `localStorage`
- **WHEN** the user opens the application or refreshes the page
- **THEN** the application initializes with the data from `localStorage`
- **AND** all boards, columns, and tasks are present as they were before the reload

#### Scenario: Handle empty storage
- **GIVEN** `localStorage` is empty or the key does not exist
- **WHEN** the user opens the application
- **THEN** the application initializes with a default/empty state (e.g., empty board list)
- **AND** no errors are thrown

### Requirement: Data Integrity
The application MUST correctly serialize and deserialize complex data types, such as dates, to ensure data integrity.

#### Scenario: Preserve Date objects
- **GIVEN** a task has a `createdAt` timestamp
- **WHEN** the state is saved and then reloaded
- **THEN** the `createdAt` property is restored as a valid Date object (or ISO string depending on store contract)
- **AND** it matches the original value

### Requirement: Error Handling
The application MUST handle storage errors gracefully without crashing.

#### Scenario: Handle storage quota exceeded
- **GIVEN** `localStorage` is full
- **WHEN** the user attempts an action that triggers a save
- **THEN** the application catches the storage error
- **AND** (Optional) displays a warning to the user
- **AND** the application continues to function in-memory
