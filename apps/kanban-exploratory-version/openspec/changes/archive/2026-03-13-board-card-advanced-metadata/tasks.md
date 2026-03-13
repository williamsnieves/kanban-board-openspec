# Tasks: Board Card Advanced Metadata

## Implementation Tasks

- [x] **Update Task Interface**
    - Add `description?: string`
    - Add `labels?: string[]`
    - Add `dueDate?: string`
    - Add `priority?: 'low' | 'medium' | 'high'`
    - Update mock data generator to include random metadata for testing.

- [x] **Create Card Detail Modal**
    - Implement `CardDetailModal` component.
    - Include editable title (reuse existing logic?).
    - Include textarea for description.
    - Include dropdown/selector for labels (hardcoded set: Bug, Feature, Urgent).
    - Include date picker for due date.
    - Include selector for priority.
    - Add close button and delete button.

- [x] **Update Card Component**
    - Add visual indicators for metadata:
        - `LabelBadges`: Row of small colored dots/pills.
        - `DueDateBadge`: Calendar icon + date text.
        - `PriorityIcon`: Up/down arrow or colored border.
        - `DescriptionIcon`: Lines icon if description exists.
    - Update click handler to open the modal instead of just selecting (or double click? Single click is standard for Kanban).

- [x] **Update Store Actions**
    - Ensure `updateTask` handles partial updates correctly.
    - Persist changes via existing persistence layer (verify it works with new fields).

## Verification Tasks

- [x] **Verify Description**
    - Add description in modal -> Saved and shows indicator on card.
    - Edit description -> Updates correctly.

- [x] **Verify Labels**
    - Add label -> Shows colored badge on card.
    - Remove label -> Badge disappears.
    - Multiple labels -> Multiple badges.

- [x] **Verify Due Date**
    - Set date -> Shows on card.
    - Clear date -> Removed from card.

- [x] **Verify Priority**
    - Set priority -> Shows icon/indicator.
    - Change priority -> Updates indicator.

- [x] **Verify Persistence**
    - Reload page -> Metadata is preserved.
