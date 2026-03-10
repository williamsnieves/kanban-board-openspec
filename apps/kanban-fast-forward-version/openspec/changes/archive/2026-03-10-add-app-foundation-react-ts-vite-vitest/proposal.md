## Why

FlowBoard needs a deterministic technical foundation before implementation to reduce drift, enforce engineering discipline, and speed future feature delivery. Defining the scaffold stack and project rules now ensures consistent execution when apply starts.

## What Changes

- Define executable setup requirements to create a working initial app skeleton using React + TypeScript + Vite.
- Define verification checkpoints proving the scaffold works (`install`, `build`, `test`, and local run smoke).
- Define test foundation with Vitest as the default unit/integration runner.
- Define Playwright baseline and configuration for QA E2E automation of core user journeys.
- Define baseline project rules via concise `AGENTS.md` focused on non-obvious guidance for agents.
- Define mandatory TDD workflow for feature implementation and AAA (Arrange-Act-Assert) test scenario structure.

## Capabilities

### New Capabilities

- `app-foundation-setup`: Technical baseline and executable setup requirements for React/TypeScript/Vite/Vitest project bootstrap.
- `qa-e2e-foundation`: Playwright configuration and E2E baseline requirements for QA agent workflows.
- `engineering-governance-rules`: Concise project-level rules and development principles documented in `AGENTS.md`.

### Modified Capabilities

- None.

## Impact

- Affected systems: repository scaffold, test strategy baseline, QA automation baseline, and development workflow expectations.
- Affected documentation: introduction of concise governance document `AGENTS.md` with non-obvious implementation constraints.
- Tooling impact: Vite, Vitest, and Playwright become baseline framework/tooling choices for MVP implementation.
