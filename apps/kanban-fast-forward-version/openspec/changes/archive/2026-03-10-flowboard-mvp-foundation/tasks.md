## 1. Domain and State Foundation

- [x] 1.1 Define typed domain models for Board, Column, and Task
- [x] 1.2 Implement initial state bootstrap with Todo/Doing/Done defaults for new boards
- [x] 1.3 Add deterministic position normalization utilities for columns and tasks

## 2. Board and Task Operations

- [x] 2.1 Implement board creation with required-name validation
- [x] 2.2 Implement board listing and board selection/open behavior
- [x] 2.3 Implement task create, edit, and delete operations with required title validation

## 3. Movement and Ordering

- [x] 3.1 Implement task reorder within a column with stable position updates
- [x] 3.2 Implement cross-column task move with deterministic insertion rules
- [x] 3.3 Add UI feedback for invalid actions and failed validations

## 4. Persistence and Reliability

- [x] 4.1 Implement local storage persistence for boards, columns, tasks, and positions
- [x] 4.2 Implement hydration on app load and refresh/reopen recovery
- [x] 4.3 Validate acceptance scenarios from `specs/kanban-board-mvp/spec.md`
