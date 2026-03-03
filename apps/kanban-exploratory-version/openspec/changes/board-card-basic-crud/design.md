# Design: Board Card Basic CRUD (MVP)

## Overview
This change defines the minimal card lifecycle on top of the existing board columns (`Todo`, `Doing`, `Done`). The implementation is UI-driven and mock-backed, with strict scope limits to keep delivery focused on essential card behavior.

## Goals
- Support create, edit, delete, and move card actions.
- Keep card data minimal (`title` only for this MVP).
- Enforce title validation (at least one non-whitespace character).
- Preserve stable card identity (`id`) across edits and moves.
- Use deterministic ordering rule: append card to end of destination column.
- Keep persistence mock-based (no API/backend integration).

## Non-Goals
- Card metadata beyond title (description, labels, assignee, due date, priority).
- Comments, attachments, subtasks, activity history.
- Real backend persistence or sync.
- Advanced ordering logic (manual reordering within a column).

## Domain Model (MVP)
Minimal conceptual model:
- `Board`
  - `columns: Column[]`
- `Column`
  - `id`
  - `name`
  - `cards: Card[]`
- `Card`
  - `id`
  - `title`

## Interaction Design

### Create Card
1. User selects column context and submits title.
2. Validate title (trimmed value must not be empty).
3. Create card with unique `id`.
4. Append to end of target column.
5. Persist in mock-backed state.

### Edit Card Title
1. User updates existing card title.
2. Validate title.
3. Apply title update without changing `id`.
4. Persist updated state.

### Delete Card
1. User requests card deletion.
2. Show confirmation UI.
3. If confirmed, remove card; if cancelled, keep state unchanged.
4. Persist resulting state.

### Move Card Between Columns
1. User triggers move from source to destination column.
2. If destination equals source, treat as no-op (no duplicate creation).
3. Remove card from source.
4. Append card to destination end.
5. Preserve same `id`.
6. Persist resulting state.

## Validation Rules
- Title input for create/edit must pass:
  - `trim(title).length >= 1`
- Invalid input blocks mutation and shows UI feedback.

## State and Persistence Strategy
- Source of truth for this change is mock-backed local state.
- CRUD and move actions update state through a consistent action pathway.
- Rehydration reads from mock persistence, reproducing the last expected board state for MVP scenarios.

## Edge Case Handling
- Empty/whitespace title on create/edit -> reject update.
- Move to same column -> no-op, keep identity and avoid duplicates.
- Delete cancelled -> state unchanged.
- Removing last card from a column -> empty column remains valid.

## Testability Notes
Define test coverage for:
- create valid/invalid title
- edit valid/invalid title
- delete confirmed/cancelled
- move to different/same column
- append ordering in destination column
- identity preservation across edit/move
- mock-backed rehydration consistency

## Risks and Mitigations
- **Risk:** Divergent behavior between CRUD actions and move action updates.
  - **Mitigation:** centralize board mutation flow and reuse validation pathways.
- **Risk:** Hidden ordering regressions when moving cards.
  - **Mitigation:** explicit append-to-end assertions in tests.
- **Risk:** Scope creep into advanced card metadata.
  - **Mitigation:** keep card model minimal and enforce non-goals in tasks.
