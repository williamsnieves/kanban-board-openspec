## Why

The archived `add-task-priority-and-due-date` artifacts define behavior well but do not provide an implementation-ready execution structure with atomic scenario slices and explicit failing→passing evidence. We need an implementation-focused change so FE, QA, and Reviewer can execute deterministically.

## What Changes

- Rebuild `task-priority-and-due-date` as a Fast Forward implementation-focused change.
- Enforce atomic scenario tasks with mandatory outputs: failing test, minimal implementation, passing evidence, reviewer validation.
- Require explicit requirement → scenario → test traceability for priority, due date, validation, card display, and persistence scenarios.
- Add closure gates so archive is blocked until apply + verify are both green.
- Keep this change scoped to OpenSpec artifacts only (no product code changes).

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `task-priority-and-due-date`: Strengthen execution governance by adding scenario-level traceability, deterministic evidence requirements, and atomic implementation tasks for existing requirements.

## Impact

- Affected artifacts: `proposal.md`, `design.md`, `tasks.md`, and delta spec in `specs/task-priority-and-due-date/spec.md`.
- Team workflow impact: FE/QA/Reviewer can execute one scenario at a time with objective completion evidence.
- Process impact: prevents definition-only completion by requiring apply and verify approval before archive.
