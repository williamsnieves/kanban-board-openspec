# Change: Board View Default Columns

## Why
For the MVP, the board view needs predictable, opinionated defaults so users can immediately understand workflow state without setup friction. Defining and enforcing default columns (`Todo`, `Doing`, `Done`) establishes a stable baseline for product behavior, testing, and future expansion.

This change also clarifies the boundary between exploratory planning and implementation by locking the first board behavior contract before adding interactions like drag-and-drop or custom column management.

## What Changes
- Define MVP board view default columns as `Todo`, `Doing`, and `Done`.
- Require default visual order as `Todo -> Doing -> Done`.
- When board data is missing or partial, UI initialization completes missing defaults.
- Preserve any existing extra/legacy columns while adding missing default columns.
- Normalize default column matching by case (for example, `todo`, `TODO`, and `Todo` map to `Todo`).
- Ensure initialization is idempotent (reopening the board does not duplicate default columns).
- Allow empty columns as a valid rendered state.
- Implement this behavior in the UI layer for this change, using mock data as the source for board state simulation.
- Explicitly exclude from scope: drag-and-drop, create/edit/delete/reorder columns, WIP limits, advanced permissions, and automation rules.

## Impact
- Affected specs:
  - New/updated capability spec for board view default column behavior.
- Affected code:
  - UI board view rendering and local initialization logic.
  - Mock data fixtures used to simulate board state variants.
