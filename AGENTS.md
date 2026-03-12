# AGENTS.md — Guardrails for AI Agents

## Principles

- **SOLID**: Single responsibility per module/component. Open for extension, closed for modification. Depend on abstractions.
- **POLA** (Principle of Least Astonishment): Code should behave as a reader would expect. Avoid surprising side effects.
- **YAGNI** (You Aren't Gonna Need It): Do not add functionality until it is required by the current task.
- **KISS** (Keep It Simple, Stupid): Prefer simple, readable solutions over clever or complex ones.

## Scope Guardrails

- Implement only what the current task explicitly requires.
- Do not refactor, clean up, or improve code outside the task scope.
- Do not add comments, docstrings, or type annotations to code you did not change.
- Do not add features, error handling, or validation beyond system boundaries.
- If something seems out of scope, stop and ask rather than proceeding.

## React + TypeScript Best Practices

- Use functional components with hooks. No class components.
- Type all props, state, and function signatures explicitly.
- Prefer named exports over default exports for components.
- Co-locate component files with their tests.
- Do not mutate state directly; always use setter functions or reducers.
- Use `@/` path alias for all internal imports (e.g., `import { Foo } from '@/components/Foo'`).

## Unit Testing (AAA Pattern)

All unit tests must follow the **Arrange → Act → Assert** pattern:

```ts
it('should do X when Y', () => {
  // Arrange
  const input = ...

  // Act
  const result = fn(input)

  // Assert
  expect(result).toBe(expected)
})
```

- Tests live alongside source files or in `src/tests/`.
- Use `@testing-library/react` for component tests.
- Mock only external dependencies, not internal modules.

## Out of Scope for This Change

- CI/CD pipeline configuration (GitHub Actions, CircleCI, etc.) is explicitly out of scope.
- Do not modify any CI pipeline files unless explicitly instructed.
