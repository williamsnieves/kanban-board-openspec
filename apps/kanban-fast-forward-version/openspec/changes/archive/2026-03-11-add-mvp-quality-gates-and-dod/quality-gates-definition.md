# MVP Quality Gates Definition

Spec reference: `specs/mvp-quality-gates/spec.md`

---

## Section 1 — MVP Quality Gate Checklist (Requirement: MVP gate criteria)

Every MVP feature must satisfy all 8 gates below before closure. Each gate is binary: **PASS** or **FAIL**. A single FAIL blocks closure.

| # | Gate name | Evaluation criteria (PASS condition) | Evaluator | Blocking |
|---|-----------|--------------------------------------|-----------|----------|
| 1 | Lint / Build | `npm run build` exits with code 0; 0 TypeScript errors, 0 lint errors in changed files | Frontend Engineer | Yes |
| 2 | Unit tests | `npm test --run` exits with code 0; all Vitest tests pass, no failures, no relevant skips | Frontend Engineer | Yes |
| 3 | E2E tests | `npm run test:e2e` exits with code 0; all Playwright tests pass; no flaky tests accepted | QA Engineer | Yes |
| 4 | Traceability | Every spec scenario has a corresponding test; describe/it names match scenario names | QA Engineer | Yes |
| 5 | Spec compliance | Reviewer has approved implementation against proposal, design, and spec | Reviewer | Yes |
| 6 | AGENTS.md compliance | No violations: no `any` types, domain code in `src/domain/`, AAA pattern in tests, no imported globals | Reviewer | Yes |
| 7 | Scope | No out-of-scope features implemented (YAGNI) | Reviewer | Yes |
| 8 | DoD checklist | All items in the Definition of Done template are checked and evidence is present | Reviewer | Yes |

**Coverage note:** Coverage thresholds are NOT numeric in MVP. Test existence (scenario→test mapping) is the sufficient criterion. Numeric thresholds are deferred to a future change.

Scenario satisfied: **Evaluate feature against gates** — when a feature is reviewed for completion, all mandatory quality gates are evaluated and recorded.

---

## Section 2 — Lint and Test Gate Criteria (Requirement: Lint and test gate)

### Gate 1 — Lint / Build

- **Command:** `npm run build` (covers `tsc -b` and ESLint in the build step)
- **PASS condition:** exit code 0, output shows no TypeScript errors, no ESLint errors
- **Warnings:** ESLint warnings are allowed but should be minimized; they do not block PASS
- **FAIL triggers:** any TypeScript error, any ESLint error, non-zero exit code

### Gate 2 — Unit tests

- **Command:** `npm test --run`
- **PASS condition:** exit code 0; output shows `Tests: N passed`
- **FAIL triggers:** any failing test, non-zero exit code, or a skipped test that is the sole coverage for a required scenario

### Gate 3 — E2E tests

- **Command:** `npm run test:e2e`
- **PASS condition:** exit code 0; output shows `N passed`
- **Flakiness:** flaky tests are not accepted — the test suite must be deterministic
- **FAIL triggers:** any failing test, non-zero exit code, any flaky test

**Universal FAIL definition:** a gate FAILS if the command exits with a non-zero code, OR any test fails, OR any TypeScript/lint error is reported.

Scenario satisfied: **Baseline technical checks** — when a feature is proposed as complete, lint and test checks pass without blocking errors.

---

## Section 3 — Evidence Format (Requirement: Evidence-based gate outcomes)

Each gate requires specific evidence before the PR is approved. Evidence must be captured and attached before requesting review.

| Gate | Required evidence | Location |
|------|------------------|----------|
| 1 — Lint / Build | `npm run build` output: `built in Xms` with 0 TypeScript errors | PR description |
| 2 — Unit tests | `npm test --run` output: `Tests: N passed (N)` | PR description |
| 3 — E2E | `npm run test:e2e` output: `N passed (Xs)` | PR description |
| 4 — Traceability | Traceability table (requirement→scenario→test) in PR description or `handoff-checklist.md` | Internal checklist |
| 5 — Spec compliance | Reviewer APPROVED comment with task-by-task breakdown | Internal checklist |
| 6 — AGENTS.md | Reviewer confirmation: "No AGENTS.md violations" | Internal checklist |
| 7 — Scope | Reviewer confirmation: "No out-of-scope features" | Internal checklist |
| 8 — DoD | Completed DoD checklist with all items checked | Internal checklist |

**Evidence locations:**
- **PR description (mandatory):** Gates 1–3 terminal output + Reviewer verdict. Both are required before merge.
- **Internal checklist (`handoff-checklist.md` or equivalent):** Gates 4–8. Checklist must be present and complete before the Reviewer can issue a READY verdict.

Scenario satisfied: **Gate evidence collection** — when gate evaluation is performed, each gate result includes corresponding proof artifact or command output reference.
