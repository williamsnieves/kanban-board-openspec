## Context

`task-dnd-interaction` already defines the product behavior for drag-and-drop, deterministic reorder/move rules, feedback rules, invalid-drop rollback, and keyboard fallback. The execution gap is not behavioral definition, but implementation clarity: without atomic tasks and explicit proof, apply/verify can drift or close ambiguously.

This design formalizes an implementation-ready execution contract for this capability using the archived `dnd-interaction-contract.md`, `acceptance-checklist.md`, and `apply-handoff.md` as normative context.

## Goals / Non-Goals

**Goals:**

- Define deterministic execution slices aligned to each DnD scenario in the capability.
- Require mandatory evidence per slice: failing test, minimal implementation, passing test proof, reviewer validation.
- Enforce requirement → scenario → test mapping across drag state, movement, feedback, rollback, and keyboard fallback.
- Block closure until apply and verify are explicitly approved.

**Non-Goals:**

- Imposing a mandatory DnD library choice at spec level (implementation may choose any compliant option).
- Expanding the feature scope beyond existing `task-dnd-interaction` behavior.

## Decisions

1. Use modified-capability delta instead of a new capability
   - Decision: Update `task-dnd-interaction` via delta spec under this change.
   - Rationale: Functional behavior already exists in main specs; this change hardens execution governance.
   - Alternative considered: New capability for governance only (rejected to avoid split ownership).

2. Scenario-first atomic execution model
   - Decision: Every scenario is executed as one atomic slice with four required outputs.
   - Rationale: Eliminates ambiguous “Define/Capture/Confirm” completion without runnable proof.
   - Alternative considered: Broad task groups without scenario granularity (rejected).

3. Contract + checklist are mandatory verification anchors
   - Decision: Implementers must use archived contract/checklist as concrete acceptance source during apply.
   - Rationale: Keeps deterministic behavior (positions, rollback invariants, keyboard parity) consistent.
   - Alternative considered: Rely on high-level spec text only (rejected as too permissive).

4. Archive gate is apply + verify green only
   - Decision: Artifact completion alone does not qualify the change for archive.
   - Rationale: Prevents spec-only closure and aligns with DoD expectations.
   - Alternative considered: archive on docs completion (rejected).

## Risks / Trade-offs

- [Risk] High number of scenario slices increases coordination overhead → Mitigation: keep each slice minimal and independently verifiable.
- [Risk] Evidence quality varies across contributors → Mitigation: reviewer gate requires explicit failing→passing artifacts for each completed task.
- [Risk] Drift between UI and store invariants in DnD flows → Mitigation: force checklist validation against contract rules before verify pass.

## Migration Plan

1. Create and validate `proposal`, `design`, delta `spec`, and `tasks` for `add-task-dnd-interaction-impl`.
2. Run apply implementation using atomic scenario slices derived from these artifacts.
3. Run verify gate; block closure on any unresolved scenario mapping or missing evidence.
4. Archive only after apply complete + verify approved.

Rollback strategy:

- If validation or scope alignment fails, update only this change artifacts and re-run OpenSpec validation.
- Keep change open until all quality gates are satisfied.

## Open Questions

- Should keyboard fallback test evidence be captured in the same suite as pointer DnD, or in a dedicated accessibility-focused suite?
- For invalid-drop UX, should animation behavior be explicitly fixed in tests or verified via state-invariant assertions only?
