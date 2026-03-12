## MODIFIED Requirements

### Requirement: Draggable task interaction

The system SHALL allow users to start dragging a task card from its current column and indicate that the task is in dragging state.

#### Scenario: Start dragging a task

- **WHEN** the user initiates drag on a task card
- **THEN** the task enters a visible dragging state and can be moved to eligible drop targets

### Requirement: Deterministic drop and reorder behavior

The system SHALL apply deterministic ordering rules when a dragged task is dropped within the same column or across columns.

#### Scenario: Drop within same column

- **WHEN** the user drops a dragged task at a new position in the same column
- **THEN** the system reorders tasks to match the drop position and normalizes positions deterministically

#### Scenario: Drop across columns

- **WHEN** the user drops a dragged task into a different column
- **THEN** the system updates the task column and inserts it at a deterministic target position

### Requirement: Valid and invalid drop feedback

The system SHALL provide explicit visual feedback for valid drop targets and block invalid drops without corrupting task order.

#### Scenario: Valid drop target highlight

- **WHEN** a dragged task hovers over a valid target
- **THEN** the target is visually highlighted as droppable

#### Scenario: Invalid drop attempt

- **WHEN** a dragged task is released over an invalid target
- **THEN** the system cancels the move and returns the task to its original position

### Requirement: Keyboard-accessible movement fallback

The system SHALL provide a keyboard-accessible fallback to move tasks between columns and reorder tasks when drag-and-drop cannot be used.

#### Scenario: Move task with keyboard fallback

- **WHEN** the user triggers keyboard movement controls for a focused task
- **THEN** the system moves or reorders the task using the same deterministic rules as drag-and-drop
