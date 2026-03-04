## Why

FlowBoard MVP needs lightweight task metadata to improve planning clarity without increasing scope complexity. Adding priority and due date now enables better task visibility while preserving deterministic and local-first behavior.

## What Changes

- Add support for task `priority` with allowed values `low`, `medium`, and `high`.
- Add optional task `dueDate` field for create and edit flows.
- Define validation behavior for invalid dates and out-of-catalog priorities.
- Require legible rendering of priority and due date in task cards.
- Persist and restore new metadata fields using local-first storage.
- Explicitly exclude reminders, notifications, advanced filters, and backend API integration.

## Capabilities

### New Capabilities

- `task-priority-and-due-date`: Defines metadata fields, validations, display behavior, and persistence rules for task priority and due date.

### Modified Capabilities

- None.

## Impact

- Affected systems: task create/edit forms, task card presentation, local persistence serialization.
- Data model impact: task entity includes `priority` and optional `dueDate`.
- API/dependency impact: no backend/API changes in this iteration.
