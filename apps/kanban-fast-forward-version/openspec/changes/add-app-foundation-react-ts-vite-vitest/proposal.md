## Why

FlowBoard needs a deterministic technical foundation before implementation to reduce drift, enforce engineering discipline, and speed future feature delivery. Defining the scaffold stack and project rules now ensures consistent execution when apply starts.

## What Changes

- Define the initial application skeleton using React + TypeScript + Vite.
- Define test foundation with Vitest as the default testing runner.
- Define baseline project rules via `AGENTS.md` covering SOLID, YAGNI, POLA, and KISS.
- Define mandatory TDD workflow for feature implementation.
- Define required AAA (Arrange-Act-Assert) structure for every test scenario.
- Keep this change spec-only (no implementation in this iteration).

## Capabilities

### New Capabilities

- `app-foundation-setup`: Technical baseline and scaffold requirements for React/TypeScript/Vite/Vitest project setup.
- `engineering-governance-rules`: Project-level rules and development principles documented in `AGENTS.md`.

### Modified Capabilities

- None.

## Impact

- Affected systems: repository structure, test strategy baseline, development workflow expectations.
- Affected documentation: introduction of governance document `AGENTS.md` and quality conventions.
- Tooling impact: Vite and Vitest become baseline framework/tooling choices for MVP implementation.
