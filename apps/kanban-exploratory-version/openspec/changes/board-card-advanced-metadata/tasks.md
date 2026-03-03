# Tasks: Board Card Advanced Metadata

## Implementation Tasks

- [ ] **Update Task Interface**
    - Add `description?: string`
    - Add `labels?: string[]`
    - Add `dueDate?: string`
    - Add `priority?: 'low' | 'medium' | 'high'`
    - Update mock data generator to include random metadata for testing.

- [ ] **Create Card Detail Modal**
    - Implement `CardDetailModal` component.
    - Include editable title (reuse existing logic?).
    - Include textarea for description.
    - Include dropdown/selector for labels (hardcoded set: Bug, Feature, Urgent).
    - Include date picker for due date.
    - Include selector for priority.
    - Add close button and delete button.

- [ ] **Update Card Component**
    - Add visual indicators for metadata:
        - `LabelBadges`: Row of small colored dots/pills.
        - `DueDateBadge`: Calendar icon + date text.
        - `PriorityIcon`: Up/down arrow or colored border.
        - `DescriptionIcon`: Lines icon if description exists.
    - Update click handler to open the modal instead of just selecting (or double click? Single click is standard for Kanban).

- [ ] **Update Store Actions**
    - Ensure `updateTask` handles partial updates correctly.
    - Persist changes via existing persistence layer (verify it works with new fields).

## Verification Tasks

- [ ] **Verify Description**
    - Add description in modal -> Saved and shows indicator on card.
    - Edit description -> Updates correctly.

- [ ] **Verify Labels**
    - Add label -> Shows colored badge on card.
    - Remove label -> Badge disappears.
    - Multiple labels -> Multiple badges.

- [ ] **Verify Due Date**
    - Set date -> Shows on card.
    - Clear date -> Removed from card.

- [ ] **Verify Priority**
    - Set priority -> Shows icon/indicator.
    - Change priority -> Updates indicator.

- [ ] **Verify Persistence**
    - Reload page -> Metadata is preserved.
