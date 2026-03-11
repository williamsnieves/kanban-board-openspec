## Why

The archived `add-task-dnd-interaction` change defined behavior clearly, but it did not leave an implementation-ready execution structure with atomic scenario slices and explicit failing→passing evidence per scenario. We need a dedicated implementation-focused change so FE, QA, and Reviewer can execute this capability with deterministic gates.

## What Changes

- Rebuild `task-dnd-interaction` as an implementation-focused Fast Forward change.
- Enforce atomic execution tasks per scenario (failing test, minimal implementation, passing evidence, reviewer validation).
- Require explicit requirement → scenario → test traceability for drag state, reorder, cross-column move, invalid-drop rollback, and keyboard fallback.
- Encode closure gates so archive is blocked until apply + verify are both green.
- Keep this change limited to OpenSpec artifacts only (no production code changes).

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `task-dnd-interaction`: Add implementation-governance constraints, deterministic evidence expectations, and scenario-level traceability requirements for execution.

## Impact

- Affected artifacts: `proposal.md`, `design.md`, `tasks.md`, and delta spec in `specs/task-dnd-interaction/spec.md`.
- Team workflow impact: FE/QA/Reviewer execute one scenario slice at a time with objective completion evidence.
- Process impact: prevents definition-only completion by requiring apply/verify success before archive.
