## 1. Bootstrap project foundation
- [ ] 1.1 Initialize/confirm React + TypeScript + Vite baseline in app workspace.
- [ ] 1.2 Ensure standard scripts exist for dev, build, test, lint, and typecheck.
- [ ] 1.3 Define minimal folder structure for app, features, shared code, and tests.

## 2. Configure test-driven workflow
- [ ] 2.1 Set up Vitest as the unit test runner.
- [ ] 2.2 Set up Testing Library for React component behavior tests.
- [ ] 2.3 Add shared test setup file and baseline test utilities.

## 3. Configure baseline quality tooling
- [ ] 3.1 Add and configure ESLint for React + TypeScript rules.
- [ ] 3.2 Add and configure Prettier for deterministic formatting.
- [ ] 3.3 Ensure lint/format responsibilities are aligned without conflicts.

## 4. Configure TypeScript alias strategy
- [ ] 4.1 Configure `@/` alias in TypeScript config.
- [ ] 4.2 Configure `@/` alias in Vite resolution settings.
- [ ] 4.3 Configure test runtime to resolve `@/` imports correctly.

## 5. Add implementation rules contract
- [ ] 5.1 Create `AGENTS.md` at app workspace root.
- [ ] 5.2 Document required principles: SOLID, POLA, YAGNI, KISS.
- [ ] 5.3 Document scope guardrails: avoid out-of-scope work and unrelated file changes.
- [ ] 5.4 Document React + TypeScript best-practice expectations.
- [ ] 5.5 Document AAA pattern requirement for unit tests.

## 6. Add minimal reference feature/module
- [ ] 6.1 Create one minimal example feature/module using the agreed folder structure.
- [ ] 6.2 Add at least one unit test for the example using AAA pattern.
- [ ] 6.3 Ensure example imports use `@/` alias where appropriate.

## 7. Verify readiness and boundaries
- [ ] 7.1 Verify dev server runs successfully.
- [ ] 7.2 Verify tests run successfully.
- [ ] 7.3 Verify lint and typecheck run successfully.
- [ ] 7.4 Confirm CI workflow setup is not implemented in this change (deferred scope).
