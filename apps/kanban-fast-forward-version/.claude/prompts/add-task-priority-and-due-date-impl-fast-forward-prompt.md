# Prompt - OpenSpec Fast Forward: add-task-priority-and-due-date-impl

You are implementing OpenSpec change: add-task-priority-and-due-date-impl in Fast Forward mode.

Agent Teams preflight (required):

- Create an Agent Team for this task with exactly 3 teammates and these roles: Frontend Engineer, QA Engineer, Reviewer.
- Reuse existing agent definitions from: /Users/williansnieves/Documents/kanban-board-openspec/apps/kanban-fast-forward-version/.claude/agents
- Use Sonnet 4.6 for all teammates.
- Lead must delegate and coordinate through the shared task list; teammates should own execution.
- If the lead starts implementing directly, stop and re-delegate to teammates.
- After all tasks are done and reported, shut down teammates and clean up the team.

Repository context:

- Root: /Users/williansnieves/Documents/kanban-board-openspec/apps/kanban-fast-forward-version
- OpenSpec changes directory: /Users/williansnieves/Documents/kanban-board-openspec/apps/kanban-fast-forward-version/openspec/changes
- This repository follows OpenSpec Fast Forward.
- You MUST implement exactly what is defined in:
  - openspec/changes/add-task-priority-and-due-date-impl/
- You MUST follow AGENTS.md and project conventions.

Agent teams setup (DO NOT recreate agents, reuse existing ones):

- Agents path: /Users/williansnieves/Documents/kanban-board-openspec/apps/kanban-fast-forward-version/.claude/agents
- Team of 3 roles:
  1. Frontend Engineer
  2. QA Engineer
  3. Reviewer
- All teammates must use model: claude-sonnet-4-6.

Execution protocol (strict):

- Work one unchecked task at a time from openspec/changes/add-task-priority-and-due-date-impl/tasks.md.
- A task can be marked done only if it includes both: (a) product code change(s) in `src/**`, and (b) related test change(s).
- Docs/spec-only updates are never sufficient to complete an implementation task.
- For each task:
  1. FE explains short implementation plan.
  2. QA defines/updates tests at the smallest valid level first (Vitest unit/integration), using E2E only when the scenario requires browser-level flow.
  3. FE implements minimal deterministic code.
  4. QA runs targeted tests first, then broader relevant suite if needed, and reports pass/fail evidence.
  5. Reviewer validates compliance against proposal/spec/design/tasks + AGENTS.md.
  6. Only then mark task as completed [x] in tasks.md.
- No scope creep. No extra features.
- If ambiguity exists, ask once, then proceed with best deterministic interpretation.

Required final output:

- Completed tasks list (with evidence).
- Pending tasks list.
- Requirement → scenario → test traceability summary.
- Changed files summary grouped by product code, tests, and docs.
- Validation log: commands executed + results (including `openspec validate <change>` and test runs).
- Reviewer verdict: READY / NOT READY for archive phase.
