## Context

FlowBoard needs explicit management behavior after initial board creation. This change defines deterministic rename/delete and empty-state behavior while keeping MVP constraints (local-first persistence, no backend).

## Goals / Non-Goals

**Goals:**

- Specify robust board management behavior (rename/delete) with clear validation and confirmation paths.
- Define predictable empty-state UX for both zero-board and zero-task contexts.
- Keep behavior aligned with local-first persistence guarantees.

**Non-Goals:**

- Implementing these behaviors in code now.
- Introducing server-side board management APIs.
- Adding collaboration or permission semantics.

## Decisions

1. Separate board management capability
   - Decision: isolate rename/delete/empty-state behavior in `board-management-basics` capability.
   - Rationale: makes requirements review and implementation handoff cleaner.
   - Alternative: fold into existing board MVP capability (rejected for clarity).

2. Confirmation gate for destructive operations
   - Decision: deletion requires explicit user confirmation.
   - Rationale: avoids accidental data loss.
   - Alternative: immediate delete with undo (deferred to future enhancements).

3. Validation and persistence invariants
   - Decision: board names cannot be empty and persisted outcomes must survive reload.
   - Rationale: deterministic behavior and reliable UX.
   - Alternative: permissive naming with cleanup later (rejected).

## Risks / Trade-offs

- [Risk] Overlapping responsibilities with earlier board specs → Mitigation: keep this change scoped to management interactions only.
- [Risk] Ambiguous empty-state rendering in edge cases → Mitigation: define separate scenarios for zero boards vs zero tasks.
- [Risk] Delete behavior may need future recovery options → Mitigation: document as future enhancement (undo/soft delete).

## Migration Plan

1. Add artifacts for `board-management-basics` capability.
2. Validate the change in OpenSpec.
3. Defer implementation to a dedicated apply phase later.

Rollback strategy:

- Revert this change artifacts if scope needs re-framing before implementation.

## Open Questions

- Should board rename uniqueness be enforced in MVP or only non-empty validation?
- Should deleting the active board auto-select another board or return to a neutral empty-state route?
