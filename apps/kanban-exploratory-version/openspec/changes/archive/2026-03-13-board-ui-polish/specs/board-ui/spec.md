## ADDED Requirements

### Requirement: Horizontal Kanban layout
The board view MUST render columns side by side in a horizontal scrollable row.

#### Scenario: Columns displayed horizontally
- **WHEN** the board view loads with one or more columns
- **THEN** each column is rendered as a distinct vertical panel
- **AND** all columns are arranged in a single horizontal row
- **AND** the row is horizontally scrollable when columns overflow the viewport

#### Scenario: Column has fixed width
- **WHEN** a column is rendered in the board view
- **THEN** the column has a consistent fixed width regardless of its content
- **AND** columns do not shrink or stretch to fill available space

### Requirement: Styled task cards
The board view MUST render each task as a visually distinct card with boundaries and spacing.

#### Scenario: Card has visual boundary
- **WHEN** a task card is rendered inside a column
- **THEN** the card has a visible border or background that distinguishes it from the column background
- **AND** the card has internal padding and rounded corners

#### Scenario: Card has hover state
- **WHEN** the user hovers over a task card
- **THEN** the card displays a subtle visual change (e.g., shadow or border color)

### Requirement: Metadata badges on card face
The board view MUST display visual indicators for task metadata fields when they are set.

#### Scenario: Label badges visible on card
- **WHEN** a task has one or more labels assigned
- **THEN** each label is shown as a small colored pill or badge on the card face

#### Scenario: Due date indicator visible on card
- **WHEN** a task has a due date set
- **THEN** the due date is displayed on the card face with a calendar prefix or icon

#### Scenario: Priority indicator visible on card
- **WHEN** a task has a priority set
- **THEN** the priority level is shown on the card face as a colored indicator or text badge

#### Scenario: Description indicator visible on card
- **WHEN** a task has a non-empty description
- **THEN** a description indicator (icon or text) is shown on the card face

#### Scenario: No badges shown for empty fields
- **WHEN** a task has no labels, no due date, no priority, and no description
- **THEN** no metadata badges are rendered on the card face

### Requirement: Functional dark mode
The board view MUST apply a dark color scheme when the user activates dark mode via the toggle.

#### Scenario: Dark mode activated by toggle
- **WHEN** the user clicks the dark mode toggle button
- **THEN** the board background, column panels, and card surfaces switch to dark color values
- **AND** text remains legible against the dark background

#### Scenario: Dark mode persists across navigation
- **WHEN** the user has activated dark mode and navigates away and back
- **THEN** the dark color scheme is still applied on return

#### Scenario: Light mode restored by toggle
- **WHEN** the user is in dark mode and clicks the toggle again
- **THEN** the board switches back to the light color scheme
