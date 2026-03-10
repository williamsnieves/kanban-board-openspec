## Context

Current work has multiple MVP behavior specs but no explicit technical bootstrap contract. This change defines foundation and governance rules so implementation teams can execute consistently with low ambiguity.

## Goals / Non-Goals

**Goals:**

- Define React + TypeScript + Vite as the application scaffold baseline.
- Define Vitest as test baseline.
- Define Playwright as E2E baseline for QA agent workflows.
- Define governance expectations in `AGENTS.md`.
- Define process expectations for TDD and AAA scenario structure.
- Ensure setup is implementation-ready with explicit smoke verification commands.

**Non-Goals:**

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

5. Playwright baseline for E2E automation
   - Rationale: gives QA agents a deterministic framework for validating user journeys.

6. `AGENTS.md` must be concise and non-obvious
   - Rationale: agent context should focus on project-specific traps (legacy/code smells/conventions), not generic guidance.

## Risks / Trade-offs

- [Risk] Upfront rules may feel rigid for rapid iteration → Mitigation: keep rules minimal and outcome-focused.
- [Risk] Overhead from strict TDD/AAA adoption → Mitigation: provide concise examples and templates in `AGENTS.md`.
- [Risk] Divergence from rules over time → Mitigation: include governance checks in DoD and review process.
- [Risk] E2E flakiness at bootstrap stage → Mitigation: start with a minimal smoke test and deterministic selectors.

## Migration Plan

1. Approve foundation and governance specs.
2. Implement scaffold and rule files in apply phase, including Playwright configuration.
3. Execute setup verification checklist (`install`, `build`, `unit`, `e2e smoke`).
4. Use quality gates to enforce adherence from first feature onward.

## Open Questions

- Should `AGENTS.md` include coding style conventions or delegate style to formatter/linter configs only?
- Should AAA requirement be strict naming in test blocks or logical sectioning only?
- Should Playwright start with Chromium-only in MVP or multi-browser matrix from day one?
