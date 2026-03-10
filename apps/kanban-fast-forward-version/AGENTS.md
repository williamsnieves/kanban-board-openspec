# AGENTS.md — Kanban Fast Forward Version

## Stack

- **React 19 + TypeScript** (strict mode)
- **Vite 7** — bundler and dev server
- **Vitest 4** — unit/integration testing (globals enabled)
- **@testing-library/react** — component rendering
- **Playwright** — E2E testing (`e2e/` folder)

## Working directory

`/Users/williansnieves/Documents/kanban-board-openspec/apps/kanban-fast-forward-version`

## TDD mandate

Write tests **before** implementation. No production code without a failing test first.

## AAA test pattern (mandatory)

Every test block must include these exact comments:

```ts
// Arrange
// Act
// Assert
```

`describe` block name = requirement name. `it` block name = scenario name.

## Vitest globals (non-obvious)

Vitest is configured with `globals: true`. Do **not** import `describe`, `it`, `expect`, `beforeEach`, etc. — they are injected automatically.

`@testing-library/jest-dom` matchers are loaded via `src/setupTests.ts`. Never import them per test file.

## Engineering principles

- **SOLID** — single responsibility per module; depend on abstractions in `src/domain/`
- **YAGNI** — implement only what the current task requires; no speculative features
- **POLA** — functions and components must behave as their names suggest; no surprising side effects
- **KISS** — prefer flat, readable code over clever abstractions

## Code smells to avoid

- Test files that import test-runner globals (already global via Vitest config)
- Components that mix domain logic with rendering (put logic in `src/domain/`)
- Catch blocks that silently swallow errors
- `any` type annotations — use `unknown` and narrow instead

## Folder conventions

| Path | Purpose |
|------|---------|
| `src/app/` | App-level components and routing |
| `src/domain/` | Business logic and types |
| `src/components/` | Shared UI components |
| `src/__tests__/` | Unit and integration tests |
| `e2e/` | Playwright E2E tests |

## Traceability convention

Every test must be traceable to a spec artifact:

| Test layer | Maps to |
|-----------|---------|
| `describe(...)` | Requirement name from spec |
| `it(...)` | Scenario name from spec |

**Baseline example:**
```
describe("React TypeScript Vite scaffold baseline")
  → Requirement: "1.3 Configure Vitest and add baseline passing test"

it("initial test execution works: baseline passing test confirms pipeline")
  → Scenario: app renders without crashing after scaffold setup
```

This chain — requirement → scenario → test name — must be maintained throughout the project.

## Known exceptions

None at this time.
