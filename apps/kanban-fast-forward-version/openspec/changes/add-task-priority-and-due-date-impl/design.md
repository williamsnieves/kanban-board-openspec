## Context

`task-priority-and-due-date` already defines product behavior for priority catalog, optional due date, validation, task card metadata, persistence, and out-of-scope boundaries. The implementation risk is execution ambiguity: without atomic and traceable slices, apply/verify can close inconsistently.

This design converts the capability into an implementation-ready execution contract using archived `task-metadata-contract.md`, `acceptance-checklist.md`, and `apply-handoff.md` as mandatory guidance.

## Goals / Non-Goals

**Goals:**

- Define deterministic scenario-first execution slices for all in-scope metadata behaviors.
- Require per-slice evidence: failing test first, minimal implementation, passing evidence, reviewer validation.
- Enforce requirement → scenario → test traceability across priority, due date, validation, display, and persistence.
- Enforce closure gate: no archive before apply and verify are both green.

**Non-Goals:**

- Adding new feature behavior outside existing capability requirements.
- Introducing reminders, notifications, advanced filtering/sorting, backend API integration, or overdue state visuals.

## Decisions

1. Use modified-capability delta for existing spec
   - Decision: implement this as `MODIFIED Requirements` under `task-priority-and-due-date`.
   - Rationale: capability exists; this change hardens execution clarity and verification discipline.
   - Alternative considered: create a governance-only capability (rejected due to split ownership).

2. Atomic scenario execution is mandatory
   - Decision: each scenario is executed as a standalone slice with four required outputs.
   - Rationale: eliminates ambiguous completion and supports deterministic review.
   - Alternative considered: broad checklist tasks (rejected as non-verifiable).

3. Contract/checklist artifacts are verification anchors
   - Decision: archived contract and acceptance checklist are treated as required acceptance references during apply/verify.
   - Rationale: preserves deterministic behavior details (allowed values, date format, storage shape, and scope boundaries).
   - Alternative considered: rely only on high-level spec text (rejected).

4. Archive blocked until apply + verify pass
   - Decision: artifact completion is not sufficient for closure.
   - Rationale: enforces implementation-before-archive policy.
   - Alternative considered: archive after docs complete (rejected).

## Risks / Trade-offs

- [Risk] Many scenario slices increase coordination overhead → Mitigation: keep each slice minimal and independently verifiable.
- [Risk] Inconsistent evidence quality across contributors → Mitigation: reviewer gate requires explicit failing→passing proof per completed task.
- [Risk] Scope creep into out-of-scope areas (notifications/filtering/backend/overdue visuals) → Mitigation: explicit boundary checks in tasks and verify gate.

## Migration Plan

1. Create and validate `proposal`, `design`, delta `spec`, and `tasks` for `add-task-priority-and-due-date-impl`.
2. Execute apply implementation with scenario-by-scenario atomic slices tied to these artifacts.
3. Run verify gate with contract/checklist traceability.
4. Archive only after apply complete + verify approved.

Rollback strategy:

- If validation fails or scope drifts, update only this change artifacts and re-run OpenSpec validation.
- Keep the change open until all gates pass.

## Open Questions

- Should due date display format be asserted as exact rendered string or validated semantically against source `YYYY-MM-DD`?
- Should backward-compat defaulting of missing `priority` to `medium` be verified only at store level or also through UI fixtures?
