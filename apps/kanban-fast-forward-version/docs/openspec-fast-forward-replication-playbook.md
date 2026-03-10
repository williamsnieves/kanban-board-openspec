# OpenSpec Fast-Forward Demo Replication Playbook (Local-Only)

## OpenSpec Official Documentation (Main)

- Workflows: <https://github.com/Fission-AI/OpenSpec/blob/main/docs/workflows.md>
- Commands: <https://github.com/Fission-AI/OpenSpec/blob/main/docs/commands.md>
- CLI: <https://github.com/Fission-AI/OpenSpec/blob/main/docs/cli.md>

This guide reproduces the same spec workflow we executed, but **without requiring push/PR**.

## 1) Goal

Replicate a full OpenSpec Fast-Forward planning cycle for a Kanban MVP using:

- `/opsx:new` + `/opsx:ff`
- `/opsx:propose`
- Validation via OpenSpec CLI

Output: complete and validated change artifacts under `openspec/changes/...`.

---

## 2) Prerequisites

- OpenSpec CLI installed (`openspec --version`)
- You are inside your target demo folder (workspace root)
- You want **spec-only** output (no `/opsx:apply` yet)

Optional:

- Git initialized locally (`git init`) if you want local commits

---

## 3) Initialize OpenSpec for Claude + GitHub Copilot

```bash
openspec --version
openspec init --tools claude,github-copilot
openspec list --json
```

Expected result:

- `openspec/` created
- `.claude/` and `.github/` integration files created

---

## 4) Enable Expanded Workflow Commands

Expanded commands include: `new`, `continue`, `ff`, `verify`, `sync`, `bulk-archive`, `onboard`.

```bash
openspec config profile
```

In the interactive flow:

1. Choose **Change delivery + workflows** (or **Change workflows only**)
2. Keep delivery as needed (`both` is typical)
3. Select workflows including:
   - `propose`, `explore`, `new`, `continue`, `ff`, `apply`, `verify`, `sync`, `archive`, `bulk-archive`, `onboard`
4. Confirm and apply

Then run:

```bash
openspec update --force
```

---

## 5) Standard Validation Commands (reuse for every spec)

```bash
openspec status --change "<change-name>" --json
openspec validate "<change-name>" --json
```

A change is planning-complete when:

- `"isComplete": true`
- validate reports `"valid": true` and no issues

---

## 6) Spec-by-Spec Replication

## Spec 1 — Foundation MVP behavior

**Change name**: `flowboard-mvp-foundation`

Recommended flow (quick path):

```text
/opsx:propose flowboard-mvp-foundation
```

Scope to include:

- Board create/list/open
- Default columns (Todo/Doing/Done)
- Task CRUD
- Move/reorder tasks
- Local-first persistence
- Deterministic validation behavior

Validate:

```bash
openspec status --change flowboard-mvp-foundation --json
openspec validate flowboard-mvp-foundation --json
```

---

## Spec 2 — Task drag-and-drop interaction

**Change name**: `add-task-dnd-interaction`

Expanded flow:

```text
/opsx:new add-task-dnd-interaction
/opsx:ff add-task-dnd-interaction
```

Scope to include:

- Drag start state
- Deterministic drop/reorder behavior
- Valid/invalid drop feedback
- Keyboard fallback movement

Validate:

```bash
openspec status --change add-task-dnd-interaction --json
openspec validate add-task-dnd-interaction --json
```

---

## Spec 3 — Board management basics

**Change name**: `add-board-management-basics`

Quick path flow:

```text
/opsx:propose add-board-management-basics
```

Scope to include:

- Rename board
- Delete board with confirmation
- Empty-state UX (no boards / no tasks)
- Local-first persistence for board-management actions

Validate:

```bash
openspec status --change add-board-management-basics --json
openspec validate add-board-management-basics --json
```

---

## Spec 4 — Task priority + due date

**Change name**: `add-task-priority-and-due-date`

Expanded flow:

```text
/opsx:new add-task-priority-and-due-date
/opsx:ff add-task-priority-and-due-date
```

Use this scope prompt when generating artifacts:

- Add `priority` enum (`low|medium|high`) and optional `dueDate`
- Create/edit task supports both fields
- Validation rejects invalid date and invalid priority values
- Task card shows priority and due date legibly
- Persist/restore metadata in local-first storage
- Out of scope: reminders, notifications, advanced filters, backend API
- Constraint: spec-only (no implementation)

Validate:

```bash
openspec status --change add-task-priority-and-due-date --json
openspec validate add-task-priority-and-due-date --json
```

---

## Spec 5 — App foundation + engineering governance

**Change name**: `add-app-foundation-react-ts-vite-vitest`

Expanded flow:

```text
/opsx:new add-app-foundation-react-ts-vite-vitest
/opsx:ff add-app-foundation-react-ts-vite-vitest
```

Scope to include:

- React + TypeScript + Vite scaffold baseline
- Vitest testing baseline
- `AGENTS.md` governance baseline
- Enforce SOLID, YAGNI, POLA, KISS
- Require TDD for feature implementation
- Require AAA pattern for test scenarios

Validate:

```bash
openspec status --change add-app-foundation-react-ts-vite-vitest --json
openspec validate add-app-foundation-react-ts-vite-vitest --json
```

---

## Spec 6 — MVP quality gates + DoD + traceability

**Change name**: `add-mvp-quality-gates-and-dod`

Expanded flow:

```text
/opsx:new add-mvp-quality-gates-and-dod
/opsx:ff add-mvp-quality-gates-and-dod
```

Scope to include:

- MVP quality gates (lint/test/evidence)
- Standard Definition of Done per feature
- Requirement -> scenario -> test traceability rule
- Review checkpoint before closure/archive readiness

Validate:

```bash
openspec status --change add-mvp-quality-gates-and-dod --json
openspec validate add-mvp-quality-gates-and-dod --json
```

---

## 7) Optional Local Git Checkpoints (No Remote Needed)

If you want local milestones without pushing:

```bash
git checkout -b feat/<change-name>
git add openspec/changes/<change-name>
git commit -m "spec: <short summary>"
```

You can skip `git push` entirely in this demo.

---

## 8) End-of-Planning Check

List all active changes:

```bash
openspec list --json
```

If you have not archived/synced yet, `openspec list --specs --json` may still show no base specs.
That is expected: these are delta specs under `openspec/changes/...` until sync/archive.

---

## 9) Next Phase (Later)

When you are ready to implement:

```text
/opsx:apply <change-name>
```

Recommended order:

1. `add-app-foundation-react-ts-vite-vitest`
2. `flowboard-mvp-foundation`
3. interaction/management/metadata changes
4. quality-gates alignment checks

(Implementation phase intentionally excluded from this replication playbook.)
