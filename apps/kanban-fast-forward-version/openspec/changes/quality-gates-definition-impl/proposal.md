## Why

The archived quality-gates change established the governance model, but it did not provide an implementation-ready execution path with atomic tasks and explicit failing→passing evidence. We need an implementation-focused change so FE, QA, and Reviewer can enforce quality gates and DoD closure deterministically.

## What Changes

- Rebuild quality-gates governance as implementation-ready Fast Forward artifacts.
- Enforce atomic tasks requiring failing check, minimal implementation, passing evidence, and reviewer validation.
- Require explicit requirement → scenario → test traceability for quality gates, DoD checklist, and traceability controls.
- Add closure rule: archive is blocked until apply + verify are both green.
- Keep this change scoped to OpenSpec artifacts only (no product code changes).

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `mvp-quality-gates`: Add execution evidence requirements and scenario-level verification expectations.
- `feature-definition-of-done`: Add implementation-ready closure checks and deterministic reviewer gate behavior.
- `requirement-traceability`: Add enforceable scenario-to-test proof requirements and closure blocking rules.

## Impact

- Affected artifacts: `proposal.md`, `design.md`, `tasks.md`, and delta specs in `specs/mvp-quality-gates/spec.md`, `specs/feature-definition-of-done/spec.md`, and `specs/requirement-traceability/spec.md`.
- Team workflow impact: implementation teams follow one unambiguous gate path with objective evidence.
- Process impact: prevents documentation-only closure by requiring apply and verify success before archive.
