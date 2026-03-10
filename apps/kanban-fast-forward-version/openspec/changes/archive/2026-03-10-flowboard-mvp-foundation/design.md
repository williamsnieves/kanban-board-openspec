## Context

FlowBoard MVP requires a minimal but complete Kanban baseline with deterministic behavior. The project operates in fast-forward mode, with clear scope already defined by the PRD and no backend requirement for the first delivery. The chosen stack is React + TypeScript + Tailwind, and persistence is local-first via browser storage.

## Goals / Non-Goals

**Goals:**

- Implement a single-user Kanban board flow that covers board creation/access, default columns, task CRUD, move/reorder, and persistence.
- Keep behavior deterministic so outcomes are stable and testable across runs.
- Minimize architecture complexity to accelerate MVP delivery.

**Non-Goals:**

- Multi-user collaboration or real-time synchronization.
- Role/permission systems.
- Backend API and database integration in this change.
- Post-MVP column customization and advanced analytics.

## Decisions

1. Local-first persistence for MVP
   - Decision: persist board state to browser local storage.
   - Rationale: fastest path to durable behavior without backend setup.
   - Alternative considered: API + database backend (rejected for MVP speed).

2. Deterministic ordering model
   - Decision: explicit numeric `position` fields for columns/tasks and stable reindexing on reorder/move.
   - Rationale: prevents implicit UI ordering drift and simplifies validation.
   - Alternative considered: array index-only ordering (rejected due to fragility during move operations).

3. Domain-first state shape
   - Decision: model `Board`, `Column`, `Task` directly in typed frontend state.
   - Rationale: aligns implementation with PRD domain model and spec requirements.
   - Alternative considered: ad-hoc UI-driven state (rejected due to weaker traceability to specs).

4. Interaction baseline for movement
   - Decision: support task move/reorder with deterministic update pipeline; drag-and-drop is preferred but implementation can start with reliable movement controls if needed.
   - Rationale: keeps requirement satisfaction independent of interaction library risk.

## Risks / Trade-offs

- [Risk] Local storage size and portability limits for larger datasets → Mitigation: constrain MVP usage scope and keep persisted structure compact.
- [Risk] Reorder/move logic can introduce position inconsistencies → Mitigation: centralized reorder utility and post-action position normalization.
- [Risk] DnD integration may increase delivery time → Mitigation: prioritize deterministic move behavior first, then layer DnD interaction.

## Migration Plan

1. Establish baseline typed models and initial board bootstrap with default columns.
2. Implement task lifecycle operations with validation and deterministic position updates.
3. Add persistence read/write boundaries around state transitions.
4. Validate refresh/reopen behavior and error handling scenarios.
5. Future migration path: introduce API persistence adapter while preserving the same domain contracts.

Rollback strategy:

- Revert to last stable commit and clear persisted local storage namespace for FlowBoard data.

## Open Questions

- Should task movement be delivered with full drag-and-drop in this first implementation pass, or with deterministic move controls first and DnD immediately after?
- Should board deletion be included in MVP scope now or tracked as a follow-up change?
