# Design: Board Management Flow

## Architecture

### Routing
- **New Route**: `/` (Home/Dashboard)
    - Displays the list of available boards.
    - Provides the interface to create a new board.
- **Updated Route**: `/board/:id`
    - Existing board view logic, now parameterized by `:id`.
    - Fetches/loads the specific board data based on the ID.

### State Management (Mock Store)
- **Store Update**: The existing store (likely `useBoardStore`) needs to be refactored or extended to handle a collection of boards.
    - `boards`: An array or map of `Board` objects.
    - `currentBoardId`: Tracks the active board being viewed.
- **Actions**:
    - `createBoard(name: string)`: Generates a unique ID, creates a new board with default columns (Todo, Doing, Done), and adds it to the store. Returns the new board ID.
    - `loadBoards()`: Retrieves the list of all boards.
    - `loadBoard(id: string)`: Sets the `currentBoardId` and ensures the board data is available.

### Components
- **DashboardView**: The main container for the home page.
- **BoardList**: A component to render the collection of boards.
- **BoardListItem**: A clickable card or list item representing a single board.
- **CreateBoardForm**: A simple form with a text input for the board name and a "Create" button. Handles validation (non-empty name).

## Data Model (Mock)
- **Board**:
    - `id`: string (UUID or simple unique string)
    - `name`: string
    - `columns`: Column[] (default columns initialized on creation)
    - `createdAt`: timestamp

## UX Flow
1.  **Landing**: User arrives at `/`.
2.  **View**: Sees a list of boards (or empty state).
3.  **Action**: Clicks "Create Board".
4.  **Input**: Enters board name in a modal or inline form.
5.  **Submit**: Clicks "Create".
6.  **Transition**: Redirects to `/board/:new-id`.
7.  **Board View**: Sees the new board with default columns.
8.  **Navigation**: Can navigate back to `/` to switch boards.

### Dark Mode
- A toggle button is rendered in the dashboard (and optionally in the board view header).
- Theme state: `theme: 'light' | 'dark'`, action: `toggleTheme()`.
- Persisted to `localStorage` under a dedicated key (e.g. `kanban-theme`).
- Applied by setting a `data-theme` attribute on `<html>` or a CSS class on a root element.
- No system-level `prefers-color-scheme` detection in this change.

## Constraints & Trade-offs
- **Mock Persistence**: Data will be lost on page reload unless we implement `localStorage` persistence in the mock store (which is a good enhancement for DX but not strictly required by the spec if "in-memory" is acceptable for now, though `localStorage` is better for "Exploratory" feel). *Decision: Use `localStorage` for the mock store to allow navigation between pages without losing data.*
- **No Delete**: Users cannot delete boards yet, so the list might grow indefinitely during testing. This is acceptable for MVP scope.
