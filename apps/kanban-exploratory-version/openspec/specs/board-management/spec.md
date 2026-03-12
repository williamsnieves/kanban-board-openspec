## ADDED Requirements

### Requirement: Create Board
The application MUST allow users to create a new board by providing a name.

#### Scenario: Create board with valid name
- **GIVEN** the user is on the dashboard
- **WHEN** the user enters a board name "Project Alpha" and submits
- **THEN** a new board named "Project Alpha" is created
- **AND** the user is redirected to the new board's view
- **AND** the new board contains the default columns (Todo, Doing, Done)

#### Scenario: Reject board creation with empty name
- **GIVEN** the user is on the dashboard
- **WHEN** the user attempts to create a board with an empty name or only whitespace
- **THEN** the board is not created
- **AND** a validation error message is displayed

### Requirement: List Boards
The application MUST display a list of all existing boards on the dashboard.

#### Scenario: Show list of existing boards
- **GIVEN** multiple boards exist ("Project A", "Project B")
- **WHEN** the user views the dashboard
- **THEN** both "Project A" and "Project B" are listed
- **AND** each item displays the board's name

#### Scenario: Show empty state
- **GIVEN** no boards have been created yet
- **WHEN** the user views the dashboard
- **THEN** a message indicating no boards exist is displayed
- **AND** the option to create a new board is prominent

### Requirement: Open Board
The application MUST allow users to open a specific board from the list.

#### Scenario: Navigate to board view
- **GIVEN** a board named "Project X" exists
- **WHEN** the user clicks on "Project X" in the dashboard list
- **THEN** the application navigates to the board view for "Project X"
- **AND** the board's columns and tasks are loaded

### Requirement: Dark Mode Toggle
The application MUST provide a toggle to switch between light and dark themes, and MUST persist the user's preference to localStorage.

#### Scenario: Toggle dark mode on
- **GIVEN** the user is on the dashboard in light mode
- **WHEN** the user clicks the dark mode toggle
- **THEN** the application switches to dark theme
- **AND** the theme preference is saved to localStorage

#### Scenario: Toggle back to light mode
- **GIVEN** the user is in dark mode
- **WHEN** the user clicks the toggle again
- **THEN** the application switches back to light theme
- **AND** the preference is updated in localStorage

#### Scenario: Persist theme preference on reload
- **GIVEN** the user previously selected dark mode
- **WHEN** the user reloads the application
- **THEN** the dark theme is applied on load (preference read from localStorage)

### Requirement: Mock Persistence
Board creation and listing MUST use the mock data store for this MVP phase.

#### Scenario: Persist board list in mock store
- **GIVEN** a board "My Board" was created in a previous session (simulated)
- **WHEN** the dashboard is loaded
- **THEN** "My Board" appears in the list
