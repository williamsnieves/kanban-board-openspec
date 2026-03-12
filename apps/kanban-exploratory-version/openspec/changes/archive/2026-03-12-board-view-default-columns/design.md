# Design: Board View Default Columns (MVP)

## Overview
This change defines UI-layer behavior for default board columns in the exploratory app. The UI initializes and normalizes board column state using mock data so the board view is consistent for MVP without backend dependencies.

Target default columns:
- `Todo`
- `Doing`
- `Done`

Canonical order:
- `Todo -> Doing -> Done`

## Goals
- Guarantee a predictable first board-view experience.
- Ensure idempotent initialization on repeated render/open cycles.
- Preserve user/legacy extra columns while filling missing defaults.
- Normalize default labels case-insensitively to canonical labels.

## Non-Goals
- Drag-and-drop interactions.
- Column CRUD (create, rename, delete, reorder).
- WIP limits, automations, advanced permissions.
- Backend persistence contract changes.

## Data Strategy (UI + Mocks)
The board view consumes mock board state and applies a normalization + completion pipeline before rendering.

Expected input shape (conceptual):
- `board.columns[]` with each column containing at least a `name` and task list.

Output shape for rendering:
- Defaults represented canonically (`Todo`, `Doing`, `Done`).
- Extras preserved and appended after defaults.
- No duplicate default columns.

## Initialization Algorithm
1. Read columns from incoming mock board data.
2. Build a case-insensitive lookup for default labels:
   - `todo` -> `Todo`
   - `doing` -> `Doing`
   - `done` -> `Done`
3. For each incoming column:
   - If it matches a default label by case-insensitive comparison:
     - Merge into canonical default bucket.
   - Otherwise:
     - Keep as extra column.
4. Ensure all defaults exist; create empty ones for missing defaults.
5. Emit render list in fixed structure:
   - defaults in canonical order, then extras in original order.
6. Keep operation idempotent by deriving output from current input each time (no additive duplication side effects).

## Edge Case Handling
- Empty column list: generate all three defaults with empty task lists.
- Partial defaults: add only missing defaults.
- Mixed-case defaults: normalize to canonical labels.
- Duplicate default variants in input (`todo` + `Todo`): collapse to one canonical default.
- Existing extras (`Blocked`, `Review`): preserve unchanged.

## Testability Notes
Use UI-level tests with mock fixtures for:
- Empty board.
- Partial board + extra column.
- Mixed-case defaults.
- Repeat initialization/re-render (assert no duplicates).
- Empty task lists across all defaults.

## Risks and Mitigations
- **Risk:** Over-normalization could incorrectly remap non-default names.
  - **Mitigation:** only normalize exact case-insensitive matches for `todo|doing|done`.
- **Risk:** Merging duplicates may lose task order/details if rules are vague.
  - **Mitigation:** define deterministic merge rule during implementation tasks (e.g., stable first-seen order by source list).
