# Change: App Foundation Setup

## Why
Subsequent functional specs depend on a stable and opinionated application base. Without an agreed setup, each feature spec risks redefining tooling, project structure, and quality standards, which creates inconsistency and slows delivery.

This change establishes the minimum foundation required to implement upcoming specs in a predictable way, aligned with React and TypeScript best practices and a test-driven workflow.

## What Changes
- Define the base stack for the exploratory app as React + TypeScript + Vite.
- Establish TDD-ready testing setup using Vitest and Testing Library.
- Include baseline code quality tooling with ESLint and Prettier.
- Configure TypeScript path alias strategy using `@/`.
- Define a minimal project structure to support scalable feature development.
- Add a minimal example feature/module to demonstrate the structure in practice.
- Add `AGENTS.md` in `apps/kanban-exploratory-version/` with implementation guardrails:
  - follow SOLID, POLA, YAGNI, and KISS
  - avoid adding out-of-scope functionality
  - avoid modifying unrelated existing code
  - follow React and TypeScript best practices
  - use AAA pattern in unit tests
- Defer CI workflow setup to a later spec/change.

## Impact
- Affected specs:
  - New/updated foundation capability spec for application bootstrap and engineering guardrails.
- Affected code:
  - App bootstrap, tooling configuration files, and base folder structure.
  - Test setup files and minimal example feature.
  - New `AGENTS.md` rules document for implementation guidance.
