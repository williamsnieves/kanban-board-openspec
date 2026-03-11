# Feature Definition of Done — Template

Spec reference: `specs/feature-definition-of-done/spec.md`

Copy this template into the PR description or `handoff-checklist.md` for every MVP feature. All items must be checked before the PR is approved and merged. No self-certification — DoD closure requires sign-off from the team lead or designated reviewer.

---

## Section 1 — DoD Checklist (Requirement: Standard feature Definition of Done)

**Feature:** <!-- fill in feature name -->
**Change directory:** <!-- e.g., openspec/changes/add-mvp-quality-gates-and-dod -->
**Reviewer:** <!-- fill in reviewer name -->
**Date:** <!-- fill in date -->

### Technical Gates

- [ ] `npm run build` passes — 0 TypeScript errors, 0 lint errors
- [ ] `npm test --run` passes — all Vitest unit/integration tests pass
- [ ] `npm run test:e2e` passes — all Playwright E2E tests pass

### Spec Compliance

- [ ] Every spec requirement is implemented
- [ ] Every spec scenario has a corresponding test with matching `describe`/`it` names
- [ ] No out-of-scope features implemented

### Traceability

- [ ] Requirement→scenario→test traceability table is complete (see Section 2)
- [ ] `describe()` names match spec requirement names
- [ ] `it()`/`test()` names match spec scenario names

### Review

- [ ] Reviewer has approved all tasks in `tasks.md`
- [ ] Reviewer verdict is **READY**
- [ ] No open blockers

### Documentation

- [ ] `AGENTS.md` updated if the feature introduces new non-obvious patterns, libraries, or constraints not previously documented
- [ ] All change artifacts present and complete: `proposal.md`, `design.md`, `spec.md`, `tasks.md` (all tasks `[x]`)
- [ ] Test evidence captured (build, test, e2e command output)
- [ ] Handoff checklist or equivalent artifact present with gate evidence

Scenario satisfied: **DoD checklist usage** — when a feature reaches final review, the standardized DoD checklist is completed and attached to the feature record.

---

## Section 2 — Requirement/Scenario Verification (Requirement: Requirement and scenario completion criteria)

Fill in one row per requirement from the feature spec. Verification is complete when all rows show ✓ Implemented and ✓ Tested.

### Requirement verification matrix

| Requirement | Status | Scenarios | Verification |
|-------------|--------|-----------|--------------|
| [Requirement name — exact string from spec.md] | ✓ Implemented / ✗ Not implemented | [Scenario 1], [Scenario 2] | ✓ Tested / ✗ Not tested |

### Scenario verification matrix

Fill in one row per scenario from the feature spec.

| Scenario | Test file | `describe()` name | `it()`/`test()` name | Status |
|----------|-----------|-------------------|----------------------|--------|
| [Scenario name — exact string from spec.md] | `src/__tests__/foo.test.tsx` | [Requirement name] | [Scenario name] | PASS / FAIL / Not tested |

**Rules:**
- Requirement names and scenario names must be used verbatim in test `describe`/`it` blocks.
- Every row in both matrices must be filled before DoD can be closed.
- Any row with ✗ Not implemented, ✗ Not tested, FAIL, or Not tested blocks closure.

Scenario satisfied: **Requirement/scenario verification** — when feature readiness is assessed, each requirement and scenario has explicit verification status.

---

## Section 3 — Documentation and Review Criteria (Requirement: Documentation and review completeness)

### Documentation required before DoD closure

1. **AGENTS.md** — must be updated if the feature introduces new non-obvious patterns, libraries, or constraints not previously documented. No update needed if nothing new was introduced.
2. **Spec artifacts** — all change artifacts present: `proposal.md`, `design.md`, `spec.md`, `tasks.md` with all tasks marked `[x]`.
3. **Test evidence** — terminal output captured for `npm run build`, `npm test --run`, and `npm run test:e2e` showing passing results.
4. **Traceability table** — requirement→scenario→test mapping documented in the PR description, `handoff-checklist.md`, or a dedicated traceability artifact.

### Review required before DoD closure

1. **Reviewer verdict is READY** — the assigned reviewer has explicitly issued a READY verdict. A NOT READY verdict with open blockers prevents closure.
2. **All reviewer blockers resolved** — no open blocker items remain in the reviewer's verdict or comments.
3. **QA sign-off** — QA Engineer has confirmed all technical gates (Gates 1–3) pass with evidence.

### DoD closure authority

The team lead or designated reviewer signs off on the completed DoD checklist. **No self-certification.** The author cannot close their own DoD.

Scenario satisfied: **DoD documentation check** — when DoD checklist is finalized, required documentation and review artifacts are present.

---

## Evidence Attachments

Paste terminal output here before requesting review:

**Build output (`npm run build`):**
```
<!-- paste output here -->
```

**Unit test output (`npm test --run`):**
```
<!-- paste output here -->
```

**E2E test output (`npm run test:e2e`):**
```
<!-- paste output here -->
```
