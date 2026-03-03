# Design: Board Card Advanced Metadata

## Architecture

### Data Model Updates
- **Task Interface**:
    ```typescript
    interface Task {
      // ... existing fields (id, title, columnId, etc.)
      description?: string;
      labels?: string[]; // Array of label IDs (e.g., 'bug', 'feature', 'urgent')
      dueDate?: string; // ISO 8601 date string
      priority?: 'low' | 'medium' | 'high';
    }
    ```
- **Label Definition**:
    - For MVP, we can hardcode a set of labels with colors:
        - `bug`: Red
        - `feature`: Blue
        - `enhancement`: Green
        - `urgent`: Orange
    - Or allow dynamic creation (out of scope for now, stick to hardcoded set for simplicity).

### Component Structure
- **Card**: Update to show metadata indicators.
    - `CardLabels`: Row of small colored dots/badges.
    - `CardDueDate`: Small calendar icon + date text (red if overdue?).
    - `CardPriority`: Icon (up arrow for high, down for low).
    - `CardDescriptionIndicator`: Small lines icon if description exists.
- **CardDetailModal**: New component.
    - **Header**: Title (editable), Close button.
    - **Body**:
        - **Description**: Textarea (auto-resize).
        - **Sidebar/Metadata Section**:
            - **Labels**: Dropdown/popover to toggle labels.
            - **Due Date**: Date picker input.
            - **Priority**: Select/Dropdown.
    - **Footer**: Delete button (moved from card face? or keep both).

### Store Actions
- `updateTask(taskId: string, updates: Partial<Task>)`: General purpose update action.
    - Already exists? If not, create it to handle partial updates of any field.

## UX/UI Decisions
- **Click to Edit**: Clicking the card body opens the modal.
- **Quick Edit**: Maybe keep title editing on the card face for speed, but detailed editing in modal.
- **Labels**: Visualized as small colored pills on the card face.
- **Due Date**: Show relative time (e.g., "Tomorrow", "In 2 days") or short date ("Dec 31").

## Constraints & Trade-offs
- **No Rich Text**: Description is plain text. Users might want bold/lists. MVP constraint: use `white-space: pre-wrap` to preserve line breaks.
- **Hardcoded Labels**: Users can't create custom labels yet. Simplifies data model significantly.
