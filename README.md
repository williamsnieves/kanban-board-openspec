# kanban-board-openspec

This repo contains **two independent Kanban app workspaces** that both implement the same product idea (FlowBoard — a lightweight Kanban board), but using **two different OpenSpec workflows**:

- **Exploratory mode**: more iterative / discovery-driven spec planning.
- **Fast Forward mode**: more deterministic / execution-dense spec planning.

The goal is to keep both approaches side-by-side while keeping their OpenSpec state fully isolated.

---

## Repository layout

```
apps/
	kanban-exploratory-version/
	kanban-fast-forward-version/
```

Each app folder is intended to be treated as its **own OpenSpec root**.

---

## The two apps

### 1) Exploratory workflow app

- Path: `apps/kanban-exploratory-version/`
- Workflow: **OpenSpec Exploratory Mode**
- Intent: iterate on requirements and artifacts with explicit checkpoints before applying/implementing.

Where to look:

- Specs / changes live under: `apps/kanban-exploratory-version/openspec/changes/`
- Planning status snapshot: `apps/kanban-exploratory-version/docs/specs-implementation-status-summary.md`
- Workflow meta prompt (exploratory): `apps/kanban-exploratory-version/openspec_metaprompt_exploratory.md`

Typical command flow (slash commands are run from the chat UI when this folder is the workspace root):

```
/opsx-explore
/opsx-propose <change-name>
/opsx-continue
/opsx-apply
/opsx-archive
```

### 2) Fast Forward workflow app

- Path: `apps/kanban-fast-forward-version/`
- Workflow: **OpenSpec Fast Forward Mode**
- Intent: generate complete planning artifacts quickly when scope is already clear, with fewer exploratory loops.

Where to look:

- Specs / changes live under: `apps/kanban-fast-forward-version/openspec/changes/`
- Workflow meta prompt (fast-forward): `apps/kanban-fast-forward-version/openspec_metaprompt_fastforward.md`
- Local-only replication playbook: `apps/kanban-fast-forward-version/docs/openspec-fast-forward-replication-playbook.md`
- Product context (PRD): `apps/kanban-fast-forward-version/docs/PRD-flowboard-kanban.md`

Typical command flow:

```
/opsx:propose <change-name>
/opsx:apply
/opsx:verify
/opsx:archive
```

---

## Core rule: keep OpenSpec contexts isolated

Open each app folder as an **independent workspace** (Cursor/VS Code), and run OpenSpec commands from inside that folder.

Why:

- OpenSpec integrations and generated commands (e.g. `.cursor/commands`) are **app-local**.
- Specs and change artifacts stay isolated per workflow.
- You avoid mixing changes from both apps in one branch/PR.

Reference docs:

- `apps/kanban-exploratory-version/docs/openspec-dual-app-workflow-summary.md`
- `apps/kanban-fast-forward-version/docs/openspec-dual-app-workflow-summary.md`

---

## Quick CLI sanity checks

From the repo root:

```bash
cd apps/kanban-exploratory-version
openspec --version
openspec list --json
```

```bash
cd apps/kanban-fast-forward-version
openspec --version
openspec list --json
```

---

## Contribution / delivery guardrails (applies to both apps)

- Do not mix exploratory and fast-forward changes in the same branch or PR.
- Create one branch per change/spec (commonly: `feat/<spec-name>`).
- Validate a change before considering it complete:

```bash
openspec status --change "<change-name>" --json
openspec validate "<change-name>" --json
```
