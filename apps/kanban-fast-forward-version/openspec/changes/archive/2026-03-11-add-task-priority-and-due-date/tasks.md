## 1. Task Model and Form Inputs

- [x] 1.1 Extend task model to include `priority` with allowed values `low|medium|high`
- [x] 1.2 Extend task model to include optional `dueDate`
- [x] 1.3 Update task create/edit forms to capture and update priority and due date

## 2. Validation and UX Rendering

- [x] 2.1 Implement validation for invalid date input with deterministic error messaging
- [x] 2.2 Implement validation to reject priorities outside `low|medium|high`
- [x] 2.3 Render priority and due date on task cards in a legible and consistent format

## 3. Persistence and Scope Guardrails

- [x] 3.1 Persist `priority` and `dueDate` in local-first task storage
- [x] 3.2 Restore `priority` and `dueDate` correctly after refresh/reopen
- [x] 3.3 Confirm out-of-scope exclusions (reminders, notifications, advanced filters, backend API) remain unimplemented
