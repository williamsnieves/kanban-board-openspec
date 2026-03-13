## Purpose

TBD — Defines rules for ordering board columns, including drag-and-drop reorder, left/right controls, and constraints for default columns.

## Requirements

### Requirement: Reorder custom columns by drag-and-drop
The board MUST allow users to reorder custom columns using drag-and-drop interactions.

#### Scenario: Move custom column to a new position using drag-and-drop
- **GIVEN** a board containing custom columns `Backlog`, `Review`, and `Blocked`
- **WHEN** the user drags `Blocked` and drops it before `Review`
- **THEN** the visual column order updates to place `Blocked` before `Review`
- **AND** the updated order is reflected in mock-backed state for the active session

### Requirement: Reorder custom columns with left/right controls
The board MUST provide left/right controls as a fallback to reorder custom columns without drag-and-drop.

#### Scenario: Move custom column one position to the right
- **GIVEN** custom column order `Backlog`, `Review`, `Blocked`
- **WHEN** the user selects move-right on `Review`
- **THEN** the order becomes `Backlog`, `Blocked`, `Review`

#### Scenario: Move custom column one position to the left
- **GIVEN** custom column order `Backlog`, `Review`, `Blocked`
- **WHEN** the user selects move-left on `Review`
- **THEN** the order becomes `Review`, `Backlog`, `Blocked`

### Requirement: Protect default columns from reorder
The board MUST prevent reorder operations for default columns `Todo`, `Doing`, and `Done`.

#### Scenario: Attempt to drag default column
- **GIVEN** default columns `Todo`, `Doing`, `Done` are present
- **WHEN** the user attempts to reorder `Todo`
- **THEN** the action is blocked
- **AND** default column order remains unchanged

#### Scenario: Attempt to use move controls on default column
- **GIVEN** default columns `Todo`, `Doing`, `Done` are present
- **WHEN** the user selects move-left or move-right on `Doing`
- **THEN** the action is blocked
- **AND** default column order remains unchanged

### Requirement: Reorder does not persist across full reload
Column reorder state MUST be treated as non-persistent across full view reload in this change.

#### Scenario: Reload board view after custom reorder
- **GIVEN** custom columns were reordered in the current session
- **WHEN** the board view is fully reloaded
- **THEN** the board does not guarantee restoration of the reordered custom column sequence

### Requirement: Keyboard-first reorder deferred
Keyboard-first reorder accessibility behavior MUST be excluded from this change.

#### Scenario: Scope validation for reorder accessibility
- **GIVEN** this change definition
- **WHEN** artifacts are reviewed
- **THEN** keyboard-first reorder support is documented as out of scope
