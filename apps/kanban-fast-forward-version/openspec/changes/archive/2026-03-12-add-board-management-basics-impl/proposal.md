## Why

The archived `add-board-management-basics` cycle captured requirements but did not provide an implementation-ready execution path with atomic, verifiable tasks. We need a new implementation-focused change so FE, QA, and Reviewer can execute one spec at a time with explicit failing→passing evidence and traceability.

## What Changes

- Rebuild board-management-basics as an implementation-ready change in Fast Forward mode.
- Add execution constraints that prohibit definition-only tasks and require atomic deliverables per task.
- Require explicit traceability from requirement → scenario → test case for every implemented behavior.
- Define quality gates for apply/verify before any archive action.
- Enable direct implementation during apply, including app/domain/test changes required by scenarios.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `board-management-basics`: Strengthen implementation governance for existing board management requirements by adding executable acceptance mapping, deterministic validation gates, and atomic task execution format.

## Impact

- Affected artifacts: `proposal.md`, `design.md`, `tasks.md`, and delta spec in `specs/board-management-basics/spec.md` for this change.
- Team workflow impact: FE/QA/Reviewer can execute with a single interpretation and objective completion evidence.
- Implementation impact: expected changes during apply include board list/view behavior, store actions, and tests linked to scenarios.
- Process impact: archive is blocked until apply + verify are both green with explicit traceability evidence.
