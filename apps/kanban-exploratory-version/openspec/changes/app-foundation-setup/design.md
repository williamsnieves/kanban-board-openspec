# Design: App Foundation Setup

## Overview
This change establishes the minimum technical foundation required to implement subsequent functional specs in the exploratory app. The setup standardizes runtime, tooling, quality checks, testing approach, and implementation guardrails so future specs can focus on business behavior instead of infrastructure decisions.

## Goals
- Bootstrap a consistent app base using React + TypeScript + Vite.
- Enable a TDD workflow with Vitest and Testing Library.
- Standardize baseline quality checks with ESLint and Prettier.
- Enable `@/` path aliasing for maintainable imports.
- Define implementation guardrails in `AGENTS.md`.
- Provide one minimal example feature/module to demonstrate structure and testing conventions.

## Non-Goals
- Implement functional product features (board, cards, workflows).
- Configure CI pipelines in this change.
- Introduce advanced architecture patterns not needed for baseline setup.
- Integrate real backend APIs.

## High-Level Architecture
The foundation has three layers:
1. **Runtime layer**: React + Vite app shell with TypeScript compiler configuration.
2. **Engineering layer**: lint/format/test/typecheck configuration and scripts.
3. **Guidance layer**: `AGENTS.md` as an explicit rules contract for implementation behavior.

## Project Structure Strategy
Define a minimal structure that scales:
- app entry and composition root
- feature-oriented folders for business modules
- shared utilities/components for cross-feature reuse
- colocated or centralized test folders (consistent convention required)

Include one small reference feature/module that demonstrates:
- production code location
- test file location
- AAA test structure
- clean imports via `@/`

## Tooling Design Decisions

### Runtime and Build
- Use Vite as the dev/build tool for fast iteration.
- Use TypeScript strictness suitable for maintainable React code.

### Testing (TDD-Ready)
- Use Vitest as unit test runner.
- Use Testing Library for component behavior tests.
- Ensure a default test setup file is available for shared test configuration.

### Code Quality
- ESLint enforces static code quality and React/TypeScript best practices.
- Prettier handles deterministic formatting.
- Keep lint and formatting responsibilities clear to avoid overlap conflicts.

### Import Alias
- Configure `@/` to map to source root.
- Ensure alias works in:
  - TypeScript compiler options
  - Vite resolution
  - test runtime resolution

## AGENTS.md Rules Contract
Add `AGENTS.md` at app workspace root with mandatory rules:
- follow SOLID, POLA, YAGNI, KISS
- avoid out-of-scope implementation
- avoid unrelated code modifications
- apply React and TypeScript best practices
- use AAA structure in unit tests

This file acts as persistent implementation guidance for future specs and multi-agent execution.

## Validation and Developer Experience
The foundation is considered ready when developers can run:
- development server
- unit tests
- lint checks
- type checks

And observe:
- one minimal feature/module present
- at least one unit test using AAA pattern
- rules accessible in `AGENTS.md`

## Risks and Mitigations
- **Risk:** Overengineering the setup before feature work starts.
  - **Mitigation:** keep only minimum baseline needed by upcoming specs.
- **Risk:** Inconsistent conventions across future changes.
  - **Mitigation:** codify conventions in `AGENTS.md` and reference feature.
- **Risk:** Tooling misalignment (alias works in app but not tests).
  - **Mitigation:** verify alias behavior in app runtime and test runtime.
