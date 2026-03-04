## Context

FlowBoard currently supports core task lifecycle operations but lacks lightweight planning metadata. This change introduces priority and optional due date fields while preserving MVP constraints: deterministic behavior, local-first persistence, and no backend dependency.

## Goals / Non-Goals

**Goals:**

- Define a strict priority catalog (`low|medium|high`) for tasks.
- Define optional `dueDate` behavior for create and edit task flows.
- Define validation and card presentation expectations for new metadata.
- Preserve local-first persistence and deterministic state restoration.

**Non-Goals:**

- Reminders or notifications.
- Advanced filtering or sorting features.
- Backend API or server persistence.
- Implementation in this iteration.

## Decisions

1. Fixed priority enum
   - Decision: priority is restricted to three values (`low`, `medium`, `high`).
   - Rationale: avoids ambiguous labels and simplifies validation.
   - Alternative considered: free-text priority (rejected due to inconsistency risk).

2. Optional due date
   - Decision: `dueDate` is optional and can be set/updated/cleared.
   - Rationale: supports flexible planning without forcing deadlines on every task.
   - Alternative considered: required due date (rejected as too strict for MVP).

3. Metadata as part of existing task domain
   - Decision: enrich task entity rather than creating auxiliary metadata object.
   - Rationale: keeps persistence and rendering paths simple.
   - Alternative considered: separate metadata storage (rejected due to complexity).

4. Local-first persistence continuity
   - Decision: include `priority` and `dueDate` in the same persisted task record.
   - Rationale: ensures consistent restore behavior after refresh/reopen.

## Risks / Trade-offs

- [Risk] Date parsing inconsistencies across inputs → Mitigation: validate date format before state writes.
- [Risk] Visual clutter in task card → Mitigation: keep metadata presentation compact and consistent.
- [Risk] Future feature pressure (alerts/filters) expanding scope → Mitigation: explicitly keep those capabilities out of scope in this change.

## Migration Plan

1. Add and validate artifacts for the `task-priority-and-due-date` capability.
2. Defer implementation to apply phase.
3. During implementation, map form validation and card rendering to these requirements.

Rollback strategy:

- Revert this change artifacts if metadata model needs redesign before implementation.

## Open Questions

- Should due date store date-only or full timestamp for MVP?
- Should card rendering include overdue visual state in this same change or a follow-up spec?
