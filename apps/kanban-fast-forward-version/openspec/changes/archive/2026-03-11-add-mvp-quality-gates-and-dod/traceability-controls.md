# Traceability Controls

Spec reference: `specs/requirement-traceability/spec.md`

---

## Section 1 — Requirement→Scenario Mapping (Requirement: Requirement-to-scenario traceability)

### Rules

1. Every requirement in `spec.md` MUST have at least one linked scenario.
2. Scenario names must be unique within a capability spec.
3. Requirement names and scenario names must be used verbatim in tests (`describe`/`it`).
4. Orphan requirements — requirements with zero scenarios — are not permitted in merged specs.

### Unique ID format

Each requirement/scenario pair receives a sequential unique ID per capability, starting at `001`:

```
REQ-{N}/SCN-{M}
```

Example: `REQ-001/SCN-001`, `REQ-001/SCN-002`, `REQ-002/SCN-001`

### Mapping table (fill one row per requirement/scenario pair)

| Unique ID | Requirement | Scenario(s) | Linked? |
|-----------|-------------|-------------|---------|
| REQ-001/SCN-001 | [Requirement name — exact from spec.md] | [Scenario name — exact from spec.md] | [ ] |

### Verification

During Reviewer final review, confirm:
- No requirement has zero scenarios (no orphan requirements).
- All scenario names are unique within the spec.
- All IDs are sequential with no gaps.

Scenario satisfied: **Requirement mapping completeness** — when a spec is reviewed, each requirement has linked scenario entries with unique identifiers.

---

## Section 2 — Scenario→Test Linkage (Requirement: Scenario-to-test traceability)

### Rules

1. Every scenario MUST have at least one test (unit/integration or E2E).
2. The test `describe()` block name must match the requirement name exactly.
3. The test `it()`/`test()` name must match the scenario name exactly, or start with the scenario name.
4. Tests must follow the AAA pattern: `// Arrange`, `// Act`, `// Assert` comments present.
5. Orphan scenarios — scenarios without tests — are a traceability FAIL and block closure.

### Test layers

| Layer | Location | Runner |
|-------|----------|--------|
| Unit / Integration | `src/__tests__/` | Vitest (`npm test --run`) |
| E2E | `e2e/` | Playwright (`npm run test:e2e`) |

Both layers count toward scenario coverage. A single scenario may have tests at both layers.

### Linkage table (fill one row per scenario)

| Scenario | Test file | `describe()` | `it()`/`test()` | Layer | Status |
|----------|-----------|--------------|-----------------|-------|--------|
| [Scenario name — exact from spec.md] | `src/__tests__/foo.test.tsx` | [Requirement name] | [Scenario name] | unit | PASS / FAIL / Missing |

### AAA pattern example

```ts
describe("Requirement name", () => {
  it("Scenario name", () => {
    // Arrange
    ...
    // Act
    ...
    // Assert
    ...
  });
});
```

Scenario satisfied: **Scenario test coverage mapping** — when implementation verification is prepared, each scenario links to one or more test cases that validate expected behavior.

---

## Section 3 — Traceability Review Checkpoint (Requirement: Traceability review gate)

### When is this checkpoint performed?

- During Reviewer final review, **before** issuing a READY verdict
- After QA Engineer has confirmed all technical gates (Gates 1–3) pass

### What the Reviewer checks

1. Every requirement in `spec.md` appears in the requirement→scenario mapping table (Section 1).
2. Every scenario in `spec.md` has at least one linked test in the scenario→test linkage table (Section 2).
3. Test `describe()`/`it()` names match requirement/scenario names verbatim or near-verbatim.
4. No orphan requirements (requirements without scenarios) remain.
5. No orphan scenarios (scenarios without tests) remain.
6. Traceability tables are present in the PR description, `handoff-checklist.md`, or a dedicated traceability artifact.

### Checkpoint outcomes

| Outcome | Condition | Next step |
|---------|-----------|-----------|
| **PASS** | Traceability is complete — all requirements have scenarios, all scenarios have tests, all names match | Reviewer may issue READY verdict |
| **FAIL** | One or more gaps exist (missing scenario, missing test, name mismatch) | Reviewer issues NOT READY verdict with specific gaps listed; author must resolve before re-review |

### Relationship to quality gates

This checkpoint enforces **Gate 4 (Traceability)** from `quality-gates-definition.md`. The Reviewer cannot issue a READY verdict until the traceability checkpoint PASSES.

Scenario satisfied: **Traceability gate enforcement** — when a feature is marked ready for closure, reviewers verify requirement→scenario→test links are complete and current.
