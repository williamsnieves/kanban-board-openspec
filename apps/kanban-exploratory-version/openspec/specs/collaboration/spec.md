# collaboration Specification

## Purpose
TBD - created by archiving change board-card-collaboration-features. Update Purpose after archive.
## Requirements
### Requirement: Card Comments
The application MUST allow users to add comments to a card.

#### Scenario: Add comment
- **GIVEN** a card exists
- **WHEN** the user adds a comment "This needs review"
- **THEN** the comment is saved with the current timestamp and author "You"
- **AND** the comment appears in the card's activity stream
- **AND** the card on the board shows a comment indicator/count

#### Scenario: Delete comment
- **GIVEN** a card has a comment
- **WHEN** the user deletes the comment
- **THEN** the comment is removed from the activity stream

### Requirement: Subtasks (Checklist)
The application MUST allow users to add subtasks to a card and track their completion.

#### Scenario: Add subtask
- **GIVEN** a card exists
- **WHEN** the user adds a subtask "Research API"
- **THEN** the subtask is added to the checklist
- **AND** the card shows a progress indicator (e.g., "0/1")

#### Scenario: Complete subtask
- **GIVEN** a card has a pending subtask
- **WHEN** the user marks the subtask as complete
- **THEN** the subtask is visually struck through or checked
- **AND** the card's progress indicator updates (e.g., "1/1")

### Requirement: Activity Log
The application MUST automatically log key actions performed on a card.

#### Scenario: Log status change
- **GIVEN** a card is in "Todo"
- **WHEN** the user moves the card to "Done"
- **THEN** an activity log entry "Moved to Done" is added to the card's history
- **AND** the entry includes the timestamp

#### Scenario: Log priority change
- **GIVEN** a card has "Low" priority
- **WHEN** the user changes priority to "High"
- **THEN** an activity log entry "Changed priority to High" is added

