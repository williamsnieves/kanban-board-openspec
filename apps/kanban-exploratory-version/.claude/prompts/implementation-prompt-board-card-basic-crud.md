# Generic Prompt Template — OpenSpec Fast Forward Apply

Use this template to generate a prompt for any `board-card-basic-crud` without hardcoding spec names.

---

You are implementing OpenSpec change: `board-card-basic-crud` in Fast Forward mode.

Agent Teams preflight (required):

- Create an Agent Team with exactly 3 teammates: Frontend Engineer, QA Engineer, Reviewer.
- Reuse existing agent definitions from `.claude/agents`.
- Lead coordinates via shared task list; teammates own execution.
- If lead starts coding directly, stop and re-delegate.

Repository context:

- Root: `kanban-board-openspec/apps/kanban-exploratory-version`
- Change path: `openspec/changes/board-card-basic-crud/`
- Follow `AGENTS.md` once created and project conventions.

Execution protocol (strict):

- Work one unchecked task at a time from `openspec/changes/board-card-basic-crud/tasks.md`.
- Do not mark a task done unless it includes both:
  - product code change(s) under `src/**`
  - related test change(s)
- Docs/spec-only edits are not enough to close an implementation task.
- Testing strategy:
  - Start with smallest valid scope first (Vitest unit/integration)
  - Use E2E for browser-critical or interaction-critical scenarios
  - If this change defines mandatory baseline E2E, run and report all required baseline flows before READY verdict.
- For each task:
  1. FE provides short implementation plan.
  2. QA updates tests (TDD-first when possible).
  3. FE implements minimal deterministic code.
  4. QA runs targeted tests, then broader relevant suite if needed.
  5. Reviewer validates against proposal/spec/design/tasks + `AGENTS.md`.
  6. Mark task complete in `tasks.md` only after evidence is present.

No scope creep. No extra features.
If ambiguity exists, ask once, then proceed with best deterministic interpretation.

Required final output:

- Completed tasks list (with evidence)
- Pending tasks list
- Requirement → scenario → test traceability summary
- Changed files grouped by product code, tests, docs
- Validation log: commands + results (including `openspec validate board-card-basic-crud` and test runs)
- Reviewer verdict: READY / NOT READY for archive
