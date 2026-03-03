# OpenSpec Exploratory Workflow - Reusable Step by Step

This is a generic playbook to create OpenSpec planning artifacts for any change in exploratory mode.

Use this document for:
- repeatable demos
- process evidence and auditability
- onboarding and team handoff

---

## Variables (Replace Per Demo)

- `<app-workspace-root>`: folder you open in your AI coding assistant for that demo
- `<change-name>`: OpenSpec change identifier (kebab-case)
- `<workflow-doc>`: name of this guide file for that demo

Example values (optional):
- `<app-workspace-root>` -> `apps/my-demo-app`
- `<change-name>` -> `add-board-default-columns`
- `<workflow-doc>` -> `openspec-exploratory-workflow-step-by-step`

---

## 0) Preconditions

- Workspace opened in your AI coding assistant: `<app-workspace-root>`
- OpenSpec installed globally (`1.2.x`)
- Active branch follows convention: `feat/<change-name>`
- Guardrail: do not mix files from other app workspaces in the same PR

Recommended checks:

```bash
cd <app-workspace-root>
openspec --version
openspec list --json
```

---

## 1) Start Discovery in Explore Mode

Command in assistant chat:

```text
/opsx-explore We are defining the spec: <change-name>.
```

Discovery outputs to capture before artifacts:
- scope boundaries (in/out)
- acceptance criteria
- edge cases
- assumptions
- explicit implementation boundary (for example: UI-first with mocks)

Tip:
- do not start writing artifacts until decisions are explicitly confirmed

---

## 2) Ensure Change Context Exists

If change scaffold already exists, continue.  
If not, create scaffold first:

```text
/opsx-new <change-name>
```

Minimum expected scaffold:
- `openspec/changes/<change-name>/.openspec.yaml`

---

## 3) Create `proposal.md`

Command in assistant chat:

```text
/opsx-continue <change-name>
```

Expected file:
- `openspec/changes/<change-name>/proposal.md`

Proposal quality checklist:
- has `## Why`
- has `## What Changes`
- clearly states in-scope/out-of-scope
- captures major assumptions

---

## 4) Create Delta Spec (`specs/.../spec.md`)

Command in assistant chat:

```text
/opsx-continue <change-name>
```

Expected file pattern:
- `openspec/changes/<change-name>/specs/<capability>/spec.md`

Spec format checklist:
- contains `## ADDED Requirements` and/or other valid delta headers
- each requirement has at least one `#### Scenario:`
- scenarios are testable and unambiguous

Validation:

```bash
openspec validate <change-name>
```

---

## 5) Create `design.md`

Command in assistant chat:

```text
/opsx-continue <change-name>
```

Expected file:
- `openspec/changes/<change-name>/design.md`

Design checklist:
- architecture/flow for the chosen scope
- constraints and tradeoffs
- risk and mitigation notes
- consistency with proposal and spec

---

## 6) Create `tasks.md`

Command in assistant chat:

```text
/opsx-continue <change-name>
```

Expected file:
- `openspec/changes/<change-name>/tasks.md`

Tasks checklist:
- actionable and implementation-ready
- traceable to requirements/scenarios
- includes validation/testing tasks
- includes quality checks (lint/tests/manual checks as needed)

---

## 7) Verify Artifact Completeness

Status command:

```bash
openspec status --change "<change-name>" --json
```

Expected:
- `proposal`: done
- `specs`: done
- `design`: done
- `tasks`: done
- `isComplete: true`

Validation command:

```bash
openspec validate <change-name>
```

Expected:
- change is valid

---

## 8) Delivery Protocol (After Planning Completes)

Once planning artifacts are complete:
1. commit only relevant files
2. push branch
3. generate PR description
4. create PR manually
5. wait for explicit confirmation before next spec

Suggested commit scope:

```text
<app-workspace-root>/openspec/changes/<change-name>/
<app-workspace-root>/docs/<workflow-doc>.md
```

---

## 9) Reusable Command Sequence

```text
/opsx-explore <topic or change intention>
/opsx-new <change-name>                 # only if scaffold does not exist
/opsx-continue <change-name>            # proposal
/opsx-continue <change-name>            # specs
/opsx-continue <change-name>            # design
/opsx-continue <change-name>            # tasks
```

Validation loop:

```bash
openspec status --change "<change-name>" --json
openspec validate <change-name>
```

---

## 10) Optional Example Mapping

For demo narration, map placeholders to your current project values:
- `<app-workspace-root>` -> `apps/<your-app-folder>`
- `<change-name>` -> `<your-change-name>`
- `<workflow-doc>` -> `<your-workflow-doc-name>`

Keep this section optional so the core guide remains generic.
