## Context

FlowBoard MVP already defines task movement requirements at a functional level. This change adds an explicit interaction contract for drag-and-drop so implementation choices stay consistent and verifiable.

## Goals / Non-Goals

**Goals:**

- Define clear DnD interaction semantics for start-drag, hover, drop, cancel, and reorder.
- Preserve deterministic ordering behavior during all movement paths.
- Include keyboard fallback interaction for baseline accessibility.

**Non-Goals:**

- Selecting a specific drag-and-drop library in this change.
- Delivering implementation code.
- Adding multi-user or real-time interaction behavior.

## Decisions

1. Interaction-first capability split
   - Decision: capture DnD behavior in a dedicated capability (`task-dnd-interaction`).
   - Rationale: keeps interaction concerns decoupled from broader board CRUD requirements.

2. Deterministic ordering as invariant
   - Decision: all drop paths must normalize positions after move/reorder.
   - Rationale: prevents ordering drift and improves test reproducibility.

3. Library-agnostic contract
   - Decision: define behavior independently of implementation technology.
   - Rationale: allows future implementation with native DnD or a third-party library without spec churn.

## Risks / Trade-offs

- [Risk] UI interaction edge cases (cancel/drop races) → Mitigation: require explicit invalid-drop rollback behavior.
- [Risk] DnD-only UX can reduce accessibility → Mitigation: add mandatory keyboard fallback requirement.
- [Risk] Over-specifying UI details can limit implementation flexibility → Mitigation: constrain spec to behavior, not visual style details.

## Migration Plan

1. Add interaction capability artifacts.
2. Validate artifacts and keep change implementation-ready for later apply phase.
3. In implementation phase, map these requirements to selected UI interaction primitives.

## Open Questions

- Should keyboard fallback use explicit move up/down + move left/right actions, or a command palette style action?
- Is auto-scroll during drag required for MVP boards with overflow?
