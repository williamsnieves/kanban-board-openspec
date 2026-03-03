## ADDED Requirements

### Requirement: Board view default columns
The board view MUST display default workflow columns as `Todo`, `Doing`, and `Done` when the board has no configured columns.

#### Scenario: Initialize defaults for an empty board
- **GIVEN** a board with no columns in UI state
- **WHEN** the user opens board view
- **THEN** the UI shows exactly `Todo`, `Doing`, and `Done`
- **AND** the order is `Todo -> Doing -> Done`

### Requirement: Idempotent UI initialization
UI default column initialization MUST be idempotent and MUST NOT duplicate default columns across re-renders or re-open events.

#### Scenario: Re-open board view after defaults were applied
- **GIVEN** board view already contains `Todo`, `Doing`, and `Done`
- **WHEN** the user refreshes or re-opens board view
- **THEN** no additional duplicate default columns are created

### Requirement: Complete missing defaults and preserve extras
When board data is partial, the UI MUST add any missing default columns and MUST preserve existing extra columns.

#### Scenario: Partial board state with one default and one extra column
- **GIVEN** board view state contains `Todo` and `Blocked`
- **WHEN** board view initializes
- **THEN** the UI adds missing defaults `Doing` and `Done`
- **AND** keeps `Blocked` unchanged

### Requirement: Case-normalized default matching
The UI MUST treat default column names case-insensitively and normalize them to canonical labels `Todo`, `Doing`, and `Done`.

#### Scenario: Lowercase and uppercase defaults in incoming mock data
- **GIVEN** incoming board data contains `todo`, `DOING`, and `Done`
- **WHEN** board view initializes
- **THEN** the UI normalizes labels to `Todo`, `Doing`, and `Done`
- **AND** does not create duplicate defaults due to case differences

### Requirement: Empty columns are valid
The board view MUST render all default columns even when there are no tasks in any column.

#### Scenario: No tasks in any column
- **GIVEN** board view has columns `Todo`, `Doing`, and `Done` with zero tasks
- **WHEN** the board is rendered
- **THEN** all three columns are visible
- **AND** each column shows an empty state without runtime errors
