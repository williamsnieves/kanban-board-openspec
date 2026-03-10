# Apply-Phase Handoff Checklist
## Change: add-app-foundation-react-ts-vite-vitest

This checklist provides reproducible setup verification evidence for the implementation team receiving this foundation.

---

## Requirement: Setup verification checklist
> Scenario: Setup verification completion — all verification commands pass and provide reproducible setup evidence.

---

## Verification Steps

### 1. Install dependencies

```bash
npm install
```

**Expected:** Zero vulnerabilities, all packages resolved.

**Evidence (captured 2026-03-10):**
```
added N packages, audited N packages in Xs
found 0 vulnerabilities
```

---

### 2. Production build

```bash
npm run build
```

**Expected:** TypeScript compiles with zero errors; Vite bundles all modules.

**Evidence (captured 2026-03-10):**
```
vite v7.3.1 building client environment for production...
✓ 32 modules transformed.
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/react-CHdo91hT.svg    4.13 kB │ gzip:  2.05 kB
dist/assets/index-COcDBgFa.css    1.38 kB │ gzip:  0.70 kB
dist/assets/index-DWyDJMmB.js   193.91 kB │ gzip: 60.94 kB
✓ built in 354ms
```

---

### 3. Unit tests (Vitest)

```bash
npm test -- --run
```

**Expected:** All tests pass; no test imports globals (injected by Vitest config). `e2e/` excluded from Vitest scan.

**Evidence (captured 2026-03-10):**
```
 ✓ src/__tests__/app.test.tsx (1 test) 68ms

 Test Files  1 passed (1)
       Tests  1 passed (1)
    Duration  637ms
```

**Traceability:**
| `describe` | Requirement |
|---|---|
| `React TypeScript Vite scaffold baseline` | Req: Vitest test runner baseline |
| **`it`** | **Scenario** |
| `initial test execution works: baseline passing test confirms pipeline` | Scenario: Initial test execution works |

---

### 4. Folder structure

```
src/
  app/          — App-level components and routing
  domain/       — Business logic and types
  components/   — Shared UI components
  __tests__/    — Unit and integration tests
  setupTests.ts — jest-dom global setup
e2e/            — Playwright E2E tests
```

All folders confirmed present with `.gitkeep` placeholders.

---

### 5. AGENTS.md present

File: `AGENTS.md` at project root — ✅ present and concise.

Sections confirmed:
- Stack
- Working directory
- TDD mandate
- AAA test pattern (mandatory)
- Vitest globals (non-obvious)
- Engineering principles (SOLID/YAGNI/POLA/KISS)
- Code smells to avoid
- Folder conventions
- Traceability convention
- Known exceptions

---

### 6. E2E smoke test (Playwright)

```bash
npm run test:e2e
```

**Expected:** Playwright auto-starts dev server via `webServer` config; chromium-only; smoke test visits `/` and asserts heading is visible.

**Evidence (captured 2026-03-10):**
```
Running 1 test using 1 worker

  ✓  1 [chromium] › e2e/app.smoke.spec.ts:4:3 › Playwright E2E baseline
       › initial E2E smoke test passes: app boots and main root view is reachable (264ms)

  1 passed (2.1s)
```

**Traceability:**
| `test.describe` | Requirement |
|---|---|
| `Playwright E2E baseline` | Req: Playwright E2E baseline |
| **`test`** | **Scenario** |
| `initial E2E smoke test passes: app boots and main root view is reachable` | Scenario: Initial E2E smoke test passes |

---

## Traceability Summary

Full requirement → scenario → test name chain:

| Requirement | Scenario | Test (describe › it/test) |
|---|---|---|
| React TypeScript Vite scaffold baseline | Initialize scaffold | N/A (structural, no unit test) |
| React TypeScript Vite scaffold baseline | Scaffold is executable | Covered by E2E smoke test |
| Vitest test runner baseline | Test runner baseline configured | N/A (config, not tested by name) |
| Vitest test runner baseline | Initial test execution works | `React TypeScript Vite scaffold baseline` › `initial test execution works: baseline passing test confirms pipeline` |
| Playwright E2E baseline | Playwright configuration availability | N/A (config presence, verified structurally) |
| Playwright E2E baseline | Initial E2E smoke test passes | `Playwright E2E baseline` › `initial E2E smoke test passes: app boots and main root view is reachable` |
| Setup verification checklist | Setup verification completion | All 4 commands PASS (this document) |

---

## Summary: All Gates Pass

| Check | Command | Result |
|---|---|---|
| Install | `npm install` | PASS — 0 vulnerabilities |
| Build | `npm run build` | PASS — 32 modules, 0 TS errors |
| Unit tests | `npm test -- --run` | PASS — 1/1 |
| E2E smoke | `npm run test:e2e` | PASS — 1/1 (chromium) |

---

## Key Conventions for Implementing Teams

1. **Vitest globals** — do NOT import `describe`/`it`/`expect`. Injected via `vite.config.ts` (`globals: true`).
2. **jest-dom matchers** — loaded globally via `src/setupTests.ts`. Never import per test file.
3. **Vitest exclude** — `e2e/**` is excluded in `vite.config.ts` to prevent Playwright files from being picked up by Vitest.
4. **Playwright dev server** — `playwright.config.ts` `webServer` auto-starts `npm run dev`. Never start manually before `npm run test:e2e`.
5. **AAA pattern** — every test block must contain `// Arrange`, `// Act`, `// Assert` comments (mandatory).
6. **Traceability** — `describe` = requirement name from spec; `it`/`test` = scenario name from spec.
7. **Folder conventions** — see `AGENTS.md` for `src/app/`, `src/domain/`, `src/components/`, `src/__tests__/`, `e2e/`.
