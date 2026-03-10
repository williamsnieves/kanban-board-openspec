# OpenSpec Dual-App Workflow Summary

## OpenSpec Official Documentation (Main)

- Workflows: <https://github.com/Fission-AI/OpenSpec/blob/main/docs/workflows.md>
- Commands: <https://github.com/Fission-AI/OpenSpec/blob/main/docs/commands.md>
- CLI: <https://github.com/Fission-AI/OpenSpec/blob/main/docs/cli.md>

## Objective

This document defines the working flow for a dual-app setup where each app has its own OpenSpec context and workflow:

- `apps/kanban-exploratory-version` -> Exploratory mode
- `apps/kanban-fast-forward-version` -> Fast Forward mode

The goal is to demonstrate both OpenSpec approaches clearly, with isolated commands, skills, and specs per app.

---

## Repository Structure

```text
kanban-board-openspec/
  apps/
    kanban-exploratory-version/
      openspec/
      .cursor/
    kanban-fast-forward-version/
      openspec/
      .cursor/
  docs/
    openspec-dual-app-workflow-summary.md
```

---

## Core Working Rule

Always open and work on each app as an independent workspace in Cursor.

Why this matters:

- OpenSpec commands/skills generated in `.cursor/` are app-local.
- Slash commands are more reliable when the app folder is the workspace root.
- Specs and changes remain isolated per approach.

---

## Recommended Session Routine

1. Open one app folder in Cursor (not both at once).
2. Confirm OpenSpec context in that app (`openspec list`, `openspec --version`).
3. Run the corresponding workflow (Exploratory or Fast Forward).
4. Commit and push only that app changes.
5. Create PR manually.
6. Wait for merge confirmation before starting the next spec.

---

## App A: Exploratory Workflow

Path:

```text
apps/kanban-exploratory-version
```

Purpose:

- Discover and refine requirements before finalizing artifacts.
- Build specs progressively with explicit confirmation between steps.

Typical command flow:

```text
/opsx-explore
/opsx-propose <change-name>      (or create change scaffold first)
/opsx-continue                   (artifact by artifact)
/opsx-apply                      (only when tasks are ready)
/opsx-archive                    (when complete and validated)
```

Useful CLI checks:

```bash
openspec list --json
openspec status --change "<change-name>" --json
openspec show "<change-name>"
openspec validate "<change-name>"
```

Branch convention:

```text
feat/<spec-name>
```

---

## App B: Fast Forward Workflow

Path:

```text
apps/kanban-fast-forward-version
```

Purpose:

- Create planning artifacts quickly when scope is already clear.
- Execute implementation with reduced discovery loops.

Typical command flow:

```text
/opsx-propose <change-name>      (or /opsx:new + /opsx:ff in expanded setup)
/opsx-apply
/opsx-verify                     (recommended before archive)
/opsx-archive
```

Useful CLI checks:

```bash
openspec list --json
openspec status --change "<change-name>" --json
openspec validate "<change-name>"
```

Branch convention:

```text
feat/<spec-name>
```

---

## Per-Spec Delivery Protocol (Both Apps)

For each spec/change:

1. Create dedicated branch (`feat/<spec-name>`).
2. Create/refine OpenSpec artifacts according to the app workflow.
3. Implement only after artifacts are ready.
4. Run validation/checks.
5. Commit.
6. Push.
7. Generate PR description.
8. Manual PR creation by user.
9. Wait for explicit merge confirmation before next spec.

---

## Quick Start Commands by App

Exploratory app:

```bash
cd apps/kanban-exploratory-version
openspec --version
openspec list --json
```

Fast Forward app:

```bash
cd apps/kanban-fast-forward-version
openspec --version
openspec list --json
```

Git branch for a new spec:

```bash
git checkout -b feat/<spec-name>
```

---

## Operational Guardrails

- Do not mix changes from both apps in the same branch/PR.
- Do not run exploratory spec commands in the fast-forward app (and vice versa).
- Do not proceed to the next spec without explicit confirmation.
- Keep change names and branch names consistent.
- If ambiguity appears, stop and clarify before continuing.

---

## Notes for Cursor Slash Commands

- Slash commands (`/opsx-...`) are triggered in the chat UI.
- Run them while the intended app folder is the active workspace root.
- If commands do not appear, ensure:
  - OpenSpec is initialized in that app.
  - `.cursor/commands` exists in that app.
  - Cursor has been restarted after setup.
