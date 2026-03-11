## Context

`mvp-quality-gates`, `feature-definition-of-done`, and `requirement-traceability` already define governance policy. The gap is execution clarity: policy alone does not guarantee deterministic apply/verify behavior across contributors unless tasks are atomic, traceable, and evidence-driven.

This design turns those governance capabilities into implementation-ready execution controls using the archived artifacts `quality-gates-definition.md`, `definition-of-done-template.md`, and `traceability-controls.md` as mandatory context.

## Goals / Non-Goals

**Goals:**

- Define scenario-first execution slices for quality gates, DoD completion, and traceability checks.
- Require mandatory evidence per slice: failing check, minimal implementation, passing evidence, reviewer validation.
- Enforce explicit requirement → scenario → test mapping across all three capabilities.
- Enforce closure gate requiring apply and verify approval before archive.

**Non-Goals:**

- Modifying product feature behavior or `src/**` implementation code.
- Introducing new governance capabilities outside the three existing ones.
- Relaxing existing blocking conditions for quality gates.

## Decisions

1. Use modified-capability deltas for all three governance specs
   - Decision: deliver `MODIFIED Requirements` under existing capabilities instead of creating new governance capabilities.
   - Rationale: keeps ownership centralized and avoids policy fragmentation.
   - Alternative considered: new execution-governance capability (rejected).

2. Atomic governance execution model
   - Decision: each scenario is implemented as an atomic task slice with four required outputs.
   - Rationale: prevents checklist completion without testable proof.
   - Alternative considered: broad checklist-only tasks (rejected).

3. Traceability proof is required for closure
   - Decision: each scenario must map to at least one runnable test/check artifact with explicit evidence.
   - Rationale: ensures reviewer decisions are auditable and deterministic.
   - Alternative considered: reviewer narrative-only justification (rejected).

4. Archive blocked unless apply + verify are green
   - Decision: artifact completion does not qualify for closure.
   - Rationale: enforces implementation-before-archive and aligns with quality gate intent.
   - Alternative considered: close after docs updates (rejected).

## Risks / Trade-offs

- [Risk] Governance tasks may feel heavy for small changes → Mitigation: keep slices minimal and scenario-scoped.
- [Risk] Evidence capture quality may vary → Mitigation: reviewer gate requires explicit failing→passing proof in each completed task.
- [Risk] Drift between documented gates and executed checks → Mitigation: verify gate cross-checks against archived context artifacts.

## Migration Plan

1. Create proposal/design/delta specs/tasks for `quality-gates-definition-impl`.
2. Validate change (`openspec status` + `openspec validate`) to ensure apply readiness.
3. Execute apply phase in a separate implementation cycle with atomic scenario slices.
4. Run verify gate and archive only after apply complete + verify approved.

Rollback strategy:

- If artifacts fail validation or scope alignment, update only this change artifacts and re-validate.
- Keep the change open until all required gates pass.

## Open Questions

- Should gate evidence aggregation be captured in a single artifact or per-scenario files as long as traceability remains explicit?
- For traceability gate failures, should reviewer feedback require one blocker per missing mapping or grouped blockers by requirement?
