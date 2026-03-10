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

**Expected:** All tests pass; no test imports globals (injected by Vitest config).

**Evidence (captured 2026-03-10):**
```
 ✓ src/__tests__/app.test.tsx (1 test) 68ms

 Test Files  1 passed (1)
       Tests  1 passed (1)
    Start at  20:17:59
    Duration  632ms
```

**Traceability:**
| `describe` | Requirement |
|---|---|
| `React TypeScript Vite scaffold baseline` | Req: Vitest test runner baseline |
| **`it`** | **Scenario** |
| `initial test execution works: baseline passing test confirms pipeline` | Scenario: Initial test execution works |

---

### 4. E2E smoke test (Playwright)

```bash
npm run test:e2e
```

**Expected:** Playwright auto-starts dev server via `webServer` config; chromium-only; smoke test visits `/` and asserts heading is visible.

**Evidence (captured 2026-03-10):**
```
Running 1 test using 1 worker

  ✓  1 [chromium] › e2e/app.smoke.spec.ts:4:3 › Playwright E2E baseline
       › initial E2E smoke test passes: app boots and main root view is reachable (308ms)

  1 passed (2.4s)
```

**Traceability:**
| `test.describe` | Requirement |
|---|---|
| `Playwright E2E baseline` | Req: Playwright E2E baseline |
| **`test`** | **Scenario** |
| `initial E2E smoke test passes: app boots and main root view is reachable` | Scenario: Initial E2E smoke test passes |

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

1. **Vitest globals** — do NOT import `describe`/`it`/`expect`. They are injected via `vite.config.ts` (`globals: true`).
2. **jest-dom matchers** — loaded globally via `src/setupTests.ts`. Never import per test file.
3. **Playwright dev server** — `playwright.config.ts` `webServer` auto-starts `npm run dev`. Never start manually before `npm run test:e2e`.
4. **AAA pattern** — every test block must contain `// Arrange`, `// Act`, `// Assert` comments (mandatory).
5. **Traceability** — `describe` = requirement name from spec; `it`/`test` = scenario name from spec.
6. **Folder conventions** — see `AGENTS.md` for `src/app/`, `src/domain/`, `src/components/`, `src/__tests__/`, `e2e/`.
