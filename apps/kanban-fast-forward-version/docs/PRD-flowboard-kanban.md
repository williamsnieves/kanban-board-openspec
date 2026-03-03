# Product Requirements Document (PRD)

## Product
**FlowBoard — Collaborative Kanban Board**

## Version
v1.0 (MVP)

## 1) Product Overview
FlowBoard is a lightweight web Kanban application for managing tasks across columns. The product provides a simple and clear workflow to create boards, organize tasks, and track progress from **Todo** to **Done**.

The MVP focuses on practical task management fundamentals with clean UX and deterministic behavior.

## 2) Problem Statement
Teams and individuals often lack a visual, structured way to track work status. Without a Kanban board:
- task status is hard to understand at a glance;
- priorities become unclear;
- coordination and execution slow down.

FlowBoard solves this by providing a visual board with ordered tasks and easy state transitions.

## 3) Goals and Objectives
### Primary Goal
Deliver a functional, reliable Kanban board MVP that enables users to manage day-to-day work visually and efficiently.

### Specific Objectives
1. Allow users to create, list, and open boards.
2. Provide a default board workflow: **Todo / Doing / Done**.
3. Enable full task lifecycle management (create, edit, delete, reorder).
4. Enable moving tasks across columns (drag and drop preferred).
5. Persist board and task data across sessions.

## 4) Out of Scope (MVP)
- Real-time multi-user collaboration.
- Advanced permissions/roles.
- Rich reporting/analytics dashboards.
- Complex automations and workflow rules.
- Native mobile apps.

## 5) Target Users
- Individual contributors tracking personal work.
- Small teams managing shared delivery tasks.
- Product and engineering teams requiring a simple visual execution board.

## 6) Functional Requirements

### 6.1 Boards
- FR-1: User can create a board with a required name.
- FR-2: User can see a list of existing boards.
- FR-3: User can open a selected board.

### 6.2 Columns
- FR-4: New boards include default columns: **Todo**, **Doing**, **Done**.
- FR-5: (Optional post-MVP) User can add, rename, and delete columns.

### 6.3 Tasks
- FR-6: User can create a task with required `title`.
- FR-7: User can edit task `title` and `description`.
- FR-8: User can delete a task.
- FR-9: User can reorder tasks within a column.

### 6.4 Task Movement
- FR-10: User can move a task from one column to another.
- FR-11: Drag-and-drop interaction is preferred for task movement.

### 6.5 Persistence
- FR-12: Application must persist boards, columns, tasks, and ordering.
- FR-13: Persistence strategy can be either:
  - Local-first browser storage (faster setup), or
  - API + database backend (more production-like).

## 7) Non-Functional Requirements
- NFR-1: Fast, responsive UI interactions.
- NFR-2: Clean, minimal, readable interface.
- NFR-3: Deterministic behavior suitable for repeatable testing.
- NFR-4: Clear error handling (e.g., empty board name, invalid task title).
- NFR-5: Basic accessibility support (keyboard navigation where feasible).

## 8) Domain Model

### Entities
- **Board**
  - `id`, `name`, `createdAt`
- **Column**
  - `id`, `boardId`, `name`, `position`
- **Task**
  - `id`, `boardId`, `columnId`, `title`, `description?`, `position`, `createdAt`, `updatedAt`

### Relationships
- A **Board** has many **Columns**.
- A **Column** has many **Tasks**.
- A **Task** belongs to exactly one **Column**.

## 9) Suggested Technical Direction

### Frontend
- Next.js (recommended) or React + Vite.
- State management: React state or a lightweight store (e.g., Zustand) for MVP.
- Task movement: native HTML5 DnD or a mature drag-and-drop library.

### Backend (optional for MVP, recommended for realism)
- REST API (or minimal GraphQL).
- SQLite or Postgres database.
- Example endpoints:
  - `GET/POST /boards`
  - `GET/POST /boards/:id/columns`
  - `GET/POST /boards/:id/tasks`
  - `PATCH /tasks/:id`
  - `DELETE /tasks/:id`

## 10) UX Principles
- Keep interactions obvious and low-friction.
- Prioritize readability over visual complexity.
- Make task status and order immediately visible.
- Provide immediate feedback for success and validation errors.

## 11) Acceptance Criteria (MVP)
1. User can create and open at least one board.
2. Newly created board always includes Todo/Doing/Done columns.
3. User can create, edit, and delete tasks.
4. User can reorder tasks within a column and move tasks between columns.
5. Data remains available after page refresh/reopen.
6. Validation prevents empty required fields and shows clear error messages.

## 12) Success Metrics
- **Activation**: % of new users who create a board and at least one task.
- **Engagement**: average number of task moves per active board/session.
- **Completion flow**: % of tasks moved to Done.
- **Reliability**: failure rate on create/edit/move/delete task actions.
- **UX quality**: qualitative feedback on clarity and ease of use.

## 13) Delivery Milestones
1. Project setup + domain skeleton (Board/Column/Task structures and base UI).
2. Board view with default columns.
3. Task CRUD.
4. Task movement + ordering (drag and drop).
5. Persistence (local-first or API-backed).
6. Optional enhancements (labels, due dates, activity log).

## 14) Risks and Mitigations
- **Risk**: Drag-and-drop complexity affects delivery timeline.  
  **Mitigation**: Start with simple move controls, then add DnD.
- **Risk**: State/order consistency bugs when moving tasks.  
  **Mitigation**: Define deterministic ordering rules and add tests.
- **Risk**: Scope creep beyond MVP.  
  **Mitigation**: Keep strict out-of-scope boundaries until MVP acceptance.

## 15) Open Decisions
- Persistence approach for MVP: local-first vs API-backed.
- Final frontend stack: Next.js vs React + Vite.
- Column management in MVP: include or defer to post-MVP.

