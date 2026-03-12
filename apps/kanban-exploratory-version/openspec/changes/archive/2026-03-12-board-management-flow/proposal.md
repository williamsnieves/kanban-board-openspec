# Change: Board Management Flow

## Why
To fulfill the core product requirement of managing multiple projects or contexts, users need the ability to create and access different boards. Currently, the application lacks a central entry point or "Dashboard" to list available boards and initiate new ones. This change establishes the fundamental navigation structure (Home -> Board) and enables the creation of named boards, which is a prerequisite for a multi-board system as defined in the PRD (FR-1, FR-2, FR-3).

## What Changes
- Implement a **Board List / Dashboard** view as the application's home page.
- Add functionality to **Create a New Board**:
    - Requires a non-empty name.
    - Redirects to the new board upon creation.
- Add functionality to **List Existing Boards**:
    - Displays names of all available boards.
    - Allows clicking a board to open its specific view.
- Update the **Mock Data Store** to support multiple boards:
    - Store boards as a collection.
    - Ensure board IDs are unique.
- Add a **Dark Mode toggle**:
    - Allows users to switch between light and dark themes.
    - Persists the user's preference to `localStorage`.
    - Applied globally across all views.
- **Out of Scope**:
    - Deleting boards.
    - Renaming boards.
    - Board descriptions or metadata.
    - Real database persistence (continue using in-memory/local mock).
    - System-level theme detection (no `prefers-color-scheme` auto-detection).

## Impact
- **New UI Route**: A new home/dashboard route is introduced.
- **Store Update**: The data model expands to handle a collection of boards rather than a single implicit board state.
- **Navigation**: The application flow changes from "direct to board" to "dashboard -> board".
- **Theme Store**: A new `useThemeStore` (or equivalent) manages the active theme and persists it to `localStorage`.
