## ADDED Requirements

### Requirement: Create card with title validation
The board MUST allow creating a card in a target column when the provided title contains at least one non-whitespace character.

#### Scenario: Create card with valid title
- **GIVEN** a board with at least one column
- **WHEN** the user creates a card with title `"Implement login"` in `Todo`
- **THEN** a new card is added to `Todo`
- **AND** the new card appears at the end of the destination column
- **AND** the card is assigned a stable identity (`id`)

#### Scenario: Reject card creation with empty title
- **GIVEN** a board with at least one column
- **WHEN** the user attempts to create a card with title `""` or `"   "`
- **THEN** the card is not created
- **AND** validation feedback is shown in UI

### Requirement: Edit card title
The board MUST allow updating the title of an existing card while preserving card identity.

#### Scenario: Update card title with valid value
- **GIVEN** an existing card in `Todo` with title `"Old title"`
- **WHEN** the user edits the title to `"New title"`
- **THEN** the card title is updated to `"New title"`
- **AND** the card keeps the same `id`

#### Scenario: Reject title edit with invalid value
- **GIVEN** an existing card with title `"Current title"`
- **WHEN** the user updates the title to whitespace-only text
- **THEN** the update is rejected
- **AND** the original title remains unchanged

### Requirement: Delete card with confirmation
The board MUST require explicit confirmation before deleting a card.

#### Scenario: Confirmed card deletion
- **GIVEN** an existing card in `Doing`
- **WHEN** the user requests delete and confirms the action
- **THEN** the card is removed from the board state

#### Scenario: Cancel card deletion
- **GIVEN** an existing card in `Doing`
- **WHEN** the user requests delete and cancels confirmation
- **THEN** the card remains unchanged in its column

### Requirement: Move card between columns
The board MUST allow moving a card between existing columns while preserving card identity.

#### Scenario: Move card to another column
- **GIVEN** an existing card in `Todo`
- **WHEN** the user moves the card to `Done`
- **THEN** the card is removed from `Todo`
- **AND** the card is added to `Done`
- **AND** the card keeps the same `id`
- **AND** the moved card is appended to the end of `Done`

#### Scenario: Move card to same column
- **GIVEN** an existing card in `Doing`
- **WHEN** the user moves the card to `Doing`
- **THEN** no duplicate card is created
- **AND** card identity is preserved

### Requirement: Mock-backed persistence for MVP
Card create/edit/delete/move operations MUST use the mock data state layer for this change, without backend API integration.

#### Scenario: Rehydrate board from mock-backed state
- **GIVEN** card operations were performed in the board view
- **WHEN** the board state is reloaded from the mock persistence layer
- **THEN** the resulting board reflects the expected card lifecycle operations
- **AND** no backend/API dependency is required
