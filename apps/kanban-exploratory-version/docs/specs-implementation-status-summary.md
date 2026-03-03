# OpenSpec Spec Implementation Summary (Exploratory App)

This document summarizes the current status of specs defined in the exploratory workflow.

## Current Snapshot

- Workspace: `apps/kanban-exploratory-version`
- Specs defined: **7**
- Planning artifacts (`proposal/spec/design/tasks`): **complete for all 7**
- Implementation (`/opsx-apply`) progress: **not started** (0 completed tasks in all changes)

## Spec Status Table

| Change | Scope Summary | Tasks (Done/Total) | Artifact Status |
|---|---|---:|---|
| `board-view-default-columns` | Default board columns (`Todo`, `Doing`, `Done`), fixed order, idempotent initialization, mock-backed | 0/18 | Complete |
| `app-foundation-setup` | React + TypeScript + Vite base, TDD tooling, lint/format, alias `@/`, `AGENTS.md` guardrails | 0/24 | Complete |
| `board-card-basic-crud` | Card create/edit/delete/move, title-only model, validation, delete confirmation, mock-backed | 0/30 | Complete |
| `board-column-basic-management` | Column create/rename/delete-empty-only, protected defaults, unique names case-insensitive | 0/31 | Complete |
| `board-column-reorder` | Custom-column reorder via drag-and-drop + left/right fallback, default columns protected | 0/25 | Complete |
| `board-management-flow` | Dashboard view, create board with name validation, list boards, navigate to board, mock persistence | 0/14 | Complete |
| `app-data-persistence` | LocalStorage adapter, state hydration on startup, date serialization, error handling | 0/10 | Complete |

## Delivered Spec Coverage (So Far)

### 1) `board-view-default-columns`
- Establishes the board baseline contract.
- Ensures default columns and safe rendering states.
- Keeps advanced interactions out of scope.

### 2) `app-foundation-setup`
- Defines the technical base and quality standards.
- Adds development guardrails through `AGENTS.md`.
- Keeps CI setup intentionally deferred.

### 3) `board-card-basic-crud`
- Adds minimum card lifecycle for MVP usage.
- Locks validation and identity behavior.
- Excludes advanced card metadata/workflows.

### 4) `board-column-basic-management`
- Adds minimum column lifecycle administration.
- Protects default workflow columns.
- Excludes manual reorder from this change.

### 5) `board-column-reorder`
- Adds custom-column reordering mechanisms.
- Protects default columns from reorder.
- Defers keyboard-first reorder accessibility.

### 6) `board-management-flow`
- Adds the entry point (Dashboard) for the application.
- Enables creating and listing multiple boards.
- Updates the mock store to handle a collection of boards.

### 7) `app-data-persistence`
- Replaces in-memory mock with `localStorage` persistence.
- Ensures data durability across sessions.
- Adds serialization and error handling for storage.

## What Is Pending

All implementation tasks are pending.  
Current totals:

- Completed tasks: **0**
- Total planned tasks: **152**

## Recommended Apply Order

To minimize dependency friction during implementation:

1. `app-foundation-setup`
2. `board-management-flow` (New entry point)
3. `app-data-persistence` (Persistence layer)
4. `board-view-default-columns`
5. `board-card-basic-crud`
6. `board-column-basic-management`
7. `board-column-reorder`

## Specs Pending Creation (Backlog)

These specs are not created yet in `openspec/changes/`.  
They remain pending definition after latest scope decisions.

| Candidate Spec | Why It Is Pending | Suggested Status |
|---|---|---|
| `board-card-advanced-metadata` | Card metadata (description, labels, due date, assignee, priority) was excluded from `board-card-basic-crud` | pending-definition |
| `board-card-collaboration-features` | Comments, attachments, subtasks, and activity history were excluded from `board-card-basic-crud` | pending-definition |

### Backlog Notes

- This backlog is a planning aid, not yet formalized as OpenSpec changes.
- Create one spec at a time and keep the same exploratory workflow protocol.
- If priorities change, reorder this backlog before creating the next change.
- Discarded from backlog by decision:
  - `ci-quality-pipeline-setup`
  - `board-column-reorder-accessibility`
  - `board-column-reorder-persistence`

## Notes

- This summary reflects the exploratory planning phase only.
- Specs are ready for implementation with `/opsx-apply` when you decide to start execution.
