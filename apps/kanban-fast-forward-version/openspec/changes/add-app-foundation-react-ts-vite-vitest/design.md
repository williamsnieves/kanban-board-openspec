## Context

Current work has multiple MVP behavior specs but no explicit technical bootstrap contract. This change defines foundation and governance rules so implementation teams can execute consistently with low ambiguity.

## Goals / Non-Goals

**Goals:**
- Define React + TypeScript + Vite as the application scaffold baseline.
- Define Vitest as test baseline.
- Define governance expectations in `AGENTS.md`.
- Define process expectations for TDD and AAA scenario structure.

**Non-Goals:**
- Actual scaffold implementation in this iteration.
- CI/CD implementation details.
- Runtime feature implementation.

## Decisions

1. Frontend baseline fixed to React + TypeScript + Vite
   - Rationale: fast setup, predictable DX, broad ecosystem support.

2. Vitest as default testing baseline
   - Rationale: tight Vite integration and fast feedback loop.

3. Governance codified in `AGENTS.md`
   - Rationale: centralized, explicit rules reduce review ambiguity.

4. TDD + AAA as mandatory workflow quality controls
   - Rationale: improves requirement traceability and test readability.

## Risks / Trade-offs

- [Risk] Upfront rules may feel rigid for rapid iteration → Mitigation: keep rules minimal and outcome-focused.
- [Risk] Overhead from strict TDD/AAA adoption → Mitigation: provide concise examples and templates in `AGENTS.md`.
- [Risk] Divergence from rules over time → Mitigation: include governance checks in DoD and review process.

## Migration Plan

1. Approve foundation and governance specs.
2. Implement scaffold and rule files in apply phase.
3. Use quality gates to enforce adherence from first feature onward.

## Open Questions

- Should `AGENTS.md` include coding style conventions or delegate style to formatter/linter configs only?
- Should AAA requirement be strict naming in test blocks or logical sectioning only?
