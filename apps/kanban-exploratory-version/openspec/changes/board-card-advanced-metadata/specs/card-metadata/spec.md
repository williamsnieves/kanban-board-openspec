## ADDED Requirements

### Requirement: Card Description
The application MUST allow users to add and edit a description for a card.

#### Scenario: Add description to card
- **GIVEN** a card with no description
- **WHEN** the user opens the card details and enters "This is a detailed description."
- **THEN** the description is saved
- **AND** the card on the board shows an indicator that it has a description

### Requirement: Card Labels
The application MUST allow users to assign labels to a card to categorize it.

#### Scenario: Add label to card
- **GIVEN** a card with no labels
- **WHEN** the user selects the "Bug" label (red)
- **THEN** the label is associated with the card
- **AND** a red label indicator appears on the card in the board view

#### Scenario: Remove label from card
- **GIVEN** a card with the "Bug" label
- **WHEN** the user removes the "Bug" label
- **THEN** the label is no longer associated with the card
- **AND** the red label indicator is removed from the board view

### Requirement: Due Date
The application MUST allow users to set a due date for a card.

#### Scenario: Set due date
- **GIVEN** a card with no due date
- **WHEN** the user selects a date (e.g., "2023-12-31")
- **THEN** the due date is saved
- **AND** the due date is displayed on the card in the board view

#### Scenario: Clear due date
- **GIVEN** a card with a due date
- **WHEN** the user clears the date
- **THEN** the due date is removed from the card

### Requirement: Priority Level
The application MUST allow users to set a priority level for a card.

#### Scenario: Set priority
- **GIVEN** a card with default priority (none/normal)
- **WHEN** the user sets the priority to "High"
- **THEN** the priority is saved
- **AND** a "High Priority" icon/badge is displayed on the card

### Requirement: Edit Metadata UI
The application MUST provide a dedicated view (modal or panel) for editing card metadata.

#### Scenario: Open card details
- **GIVEN** a card exists on the board
- **WHEN** the user clicks on the card
- **THEN** a modal/panel opens displaying all card details (title, description, labels, due date, priority)
- **AND** the user can edit any field from this view
