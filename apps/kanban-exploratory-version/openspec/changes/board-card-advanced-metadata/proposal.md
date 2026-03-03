# Change: Board Card Advanced Metadata

## Why
Currently, cards only contain a title. To support real-world task management, users need to capture more context about their work. Adding descriptions, labels, due dates, and priority levels transforms the card from a simple placeholder into a useful unit of work. This aligns with the "Task" entity definition in the PRD (FR-7 mentions description, but we are expanding to a fuller set of metadata).

## What Changes
- **Data Model**: Extend the `Task` interface to include:
    - `description`: string (optional)
    - `labels`: string[] (array of label IDs or names)
    - `dueDate`: string (ISO date, optional)
    - `priority`: 'low' | 'medium' | 'high' (optional)
- **UI**:
    - Update **Card Component** to display icons/badges for metadata (e.g., small label dots, due date icon).
    - Create a **Card Detail Modal** (or side panel) that opens when clicking a card. This view allows editing all metadata fields.
- **Store**: Update actions to support partial updates of these new fields.
- **Out of Scope**:
    - File attachments.
    - Comments.
    - Subtasks.
    - User assignment.
    - Rich text editor (simple textarea for description is sufficient for MVP).

## Impact
- **UX**: The card interaction becomes deeper; clicking a card now opens a detail view instead of just being draggable.
- **Visuals**: The board view becomes richer with metadata indicators.
- **Persistence**: The new fields must be persisted (covered by the existing persistence layer if the store structure is updated correctly).
