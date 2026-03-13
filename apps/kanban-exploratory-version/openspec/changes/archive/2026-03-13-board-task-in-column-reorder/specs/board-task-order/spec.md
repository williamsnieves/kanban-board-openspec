## ADDED Requirements

### Requirement: Reorder tasks within the same column

The system MUST allow reordering a task within a single existing column by moving it from a valid source position to a valid destination position in that same column.

#### Scenario: Move task upward within a column

- **WHEN** a task in `Todo` is reordered from a higher index to a lower index within `Todo`
- **THEN** the resulting order in `Todo` reflects the moved task at the destination position and preserves all other tasks in deterministic relative order

#### Scenario: Move task downward within a column

- **WHEN** a task in `Todo` is reordered from a lower index to a higher index within `Todo`
- **THEN** the resulting order in `Todo` reflects the moved task at the destination position and preserves all other tasks in deterministic relative order

### Requirement: Preserve task identity during reorder

The system MUST preserve task identity and payload when a valid in-column reorder operation is applied.

#### Scenario: Reordered task keeps identity

- **WHEN** a task is reordered within the same column
- **THEN** the reordered task keeps the same unique identity and content fields after the operation

### Requirement: No-op safety for same-position reorder

The system MUST treat in-column reorder requests where source and destination positions are equal as a no-op.

#### Scenario: Source and destination are the same

- **WHEN** a task reorder request uses the same source and destination index in a column
- **THEN** the system performs no state mutation for task ordering

### Requirement: Reject invalid reorder inputs safely

The system MUST reject invalid in-column reorder requests without mutating board state.

#### Scenario: Source index is out of range

- **WHEN** an in-column reorder request provides a source index outside the current task list bounds
- **THEN** the reorder operation is rejected and the task order remains unchanged

#### Scenario: Destination index is out of range

- **WHEN** an in-column reorder request provides a destination index outside the current task list bounds
- **THEN** the reorder operation is rejected and the task order remains unchanged

### Requirement: Reorder scope is limited to behavior, not interaction method

The system MUST define reorder requirements independently of a specific interaction mechanism.

#### Scenario: Behavior contract remains valid without mandated UI mechanism

- **WHEN** in-column reorder behavior is implemented using any interaction method
- **THEN** compliance is determined by ordering outcomes, not by requiring drag-and-drop or any specific UI technique

### Requirement: Reorder change does not alter cross-column movement behavior

The system MUST keep existing cross-column task movement semantics unchanged as part of this change.

#### Scenario: Intra-column reorder does not redefine inter-column move

- **WHEN** this capability is applied to the board behavior contract
- **THEN** cross-column task movement rules remain governed by existing movement requirements outside this capability
