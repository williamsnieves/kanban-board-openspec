## 1. Domain and State Foundation

- [ ] 1.1 Define typed domain models for Board, Column, and Task
- [ ] 1.2 Implement initial state bootstrap with Todo/Doing/Done defaults for new boards
- [ ] 1.3 Add deterministic position normalization utilities for columns and tasks

## 2. Board and Task Operations

- [ ] 2.1 Implement board creation with required-name validation
- [ ] 2.2 Implement board listing and board selection/open behavior
- [ ] 2.3 Implement task create, edit, and delete operations with required title validation

## 3. Movement and Ordering

- [ ] 3.1 Implement task reorder within a column with stable position updates
- [ ] 3.2 Implement cross-column task move with deterministic insertion rules
- [ ] 3.3 Add UI feedback for invalid actions and failed validations

## 4. Persistence and Reliability

- [ ] 4.1 Implement local storage persistence for boards, columns, tasks, and positions
- [ ] 4.2 Implement hydration on app load and refresh/reopen recovery
- [ ] 4.3 Validate acceptance scenarios from `specs/kanban-board-mvp/spec.md`