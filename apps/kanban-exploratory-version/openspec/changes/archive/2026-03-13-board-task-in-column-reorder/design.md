## Context

The proposal defines an MVP gap: task reorder behavior inside the same column is required by PRD but not explicitly specified in the current exploratory set. Existing card CRUD behavior covers create/edit/delete/move and explicitly excludes manual in-column ordering, so this change introduces only the missing ordering contract while preserving current movement semantics.

Constraints:

- Keep terminology aligned with PRD (`task`).
- Scope is behavior-only for intra-column reorder.
- Do not require a specific interaction method (drag-and-drop can be layered later).
- Do not include persistence or cross-column movement changes in this design.

## Goals / Non-Goals

**Goals:**

- Define deterministic in-column reorder behavior for tasks.
- Preserve task identity and content during reorder.
- Define no-op behavior for same-position reorder.
- Define invalid-input safety (no state mutation on invalid indices).
- Keep the design implementation-agnostic at interaction layer.

**Non-Goals:**

- Defining drag-and-drop UX details or library choice.
- Changing cross-column move rules.
- Introducing persistence requirements.
- Expanding task metadata or collaboration behavior.

## Decisions

1. **Behavior-first contract over interaction-first contract**
   - Decision: Specify reorder semantics independently of UI gesture/mechanism.
   - Rationale: Keeps requirements stable regardless of whether UI uses DnD, keyboard controls, or action buttons.
   - Alternative considered: mandate DnD in this spec.
   - Why not now: would couple behavior requirements to a specific UX implementation and increase MVP scope.

2. **Index-based reorder semantics within one column**
   - Decision: Model reorder as moving a task from `sourceIndex` to `destinationIndex` in the same column.
   - Rationale: Deterministic and testable contract that is framework-agnostic.
   - Alternative considered: position-token or relative (“move before/after”) API.
   - Why not now: adds unnecessary abstraction for MVP scope.

3. **Strict boundary between intra-column reorder and inter-column move**
   - Decision: This change only defines in-column reorder semantics.
   - Rationale: Prevents overlap with existing move behavior and reduces regression surface.
   - Alternative considered: unify reorder and move into one operation family.
   - Why not now: would mix concerns and blur responsibilities between existing and new capability specs.

4. **Invalid operations are safe no-mutation outcomes**
   - Decision: Same-index or out-of-range operations do not mutate board state.
   - Rationale: Predictable behavior and easier debugging/testing.
   - Alternative considered: throw hard errors for invalid indices.
   - Why not now: unnecessary complexity for MVP flow; no-mutation contract is sufficient.

## Risks / Trade-offs

- [Risk] Terminology drift between `task` (PRD) and internal existing usage (`card`) could create confusion. → Mitigation: keep external requirement language as `task` and clarify mapping in spec scenarios/notes.
- [Risk] Ambiguity in boundary with inter-column movement could cause duplicated logic. → Mitigation: state explicitly that this spec does not alter move-between-columns behavior.
- [Risk] Different UI implementations may interpret reorder triggers differently. → Mitigation: enforce behavior via scenario outcomes (before/after order), not interaction mechanics.
- [Risk] Off-by-one mistakes in reorder semantics during implementation. → Mitigation: require explicit upward/downward/no-op/invalid-index scenarios in spec and tests.

## Migration Plan

- No data migration required.
- No API migration required.
- No rollout gating required at artifact stage.
- If later persistence is introduced, it will be handled in a separate change.

## Open Questions

- Should the future persistence change treat reordered positions as full list rewrites or incremental position updates?
- For accessibility-focused follow-up, should keyboard-first reorder semantics be specified as a separate capability or an extension of this one?
