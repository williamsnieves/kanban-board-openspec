# Tasks: Board Management Flow

## Implementation Tasks

- [x] **Create Dashboard Components**
    - Create `DashboardView` component as the new home page.
    - Implement `BoardList` component to display existing boards.
    - Implement `CreateBoardForm` component with name input and validation.
    - Add basic styling for the dashboard layout.

- [x] **Update Store for Multi-Board Support**
    - Refactor `useBoardStore` (or equivalent) to manage a collection of boards (`boards: Board[]`).
    - Add `createBoard(name: string)` action:
        - Generate unique ID.
        - Initialize with default columns (Todo, Doing, Done).
        - Add to store.
    - Add `loadBoards()` action to retrieve the list.
    - Add `setCurrentBoard(id: string)` action to select the active board.

- [x] **Implement Routing**
    - Update router configuration:
        - Set `/` route to `DashboardView`.
        - Set `/board/:id` route to `BoardView`.
    - Ensure navigation works correctly between dashboard and board view.

- [x] **Update Board View Logic**
    - Modify `BoardView` to read the `id` param from the URL.
    - Call `setCurrentBoard(id)` on mount or update.
    - Handle "Board Not Found" state gracefully (redirect to dashboard or show error).

- [x] **Add Mock Persistence (LocalStorage)**
    - Implement simple `localStorage` persistence for the `boards` collection in the store.
    - Ensure data survives page reloads for better testing experience.

- [x] **Implement Dark Mode Toggle**
    - Create `useThemeStore` with state `theme: 'light' | 'dark'` and action `toggleTheme()`.
    - Persist theme preference to `localStorage` (key: `kanban-theme`).
    - Read persisted preference on store initialization.
    - Apply theme by setting `data-theme` attribute on `document.documentElement`.
    - Add a toggle button to `DashboardView` (and `BoardView` header if present).

## Verification Tasks

- [x] **Verify Board Creation**
    - Test creating a board with a valid name -> Redirects to new board with default columns.
    - Test creating a board with an empty name -> Shows validation error.

- [x] **Verify Board Listing**
    - Create multiple boards.
    - Go to dashboard.
    - Verify all created boards are listed with correct names.

- [x] **Verify Navigation**
    - Click a board in the list -> Navigates to correct board view.
    - Use browser back button -> Returns to dashboard.
    - Reload page on board view -> Stays on board view (with data if persisted).
