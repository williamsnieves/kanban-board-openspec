# Design: Board Column Basic Management (MVP)

## Overview
This change introduces minimal column management capabilities on top of the existing board structure: create, rename, and delete (empty-only) custom columns. It preserves default workflow integrity by protecting `Todo`, `Doing`, and `Done` from deletion and keeps persistence mock-based for the exploratory MVP phase.

## Goals
- Allow users to create custom columns with valid names.
- Allow users to rename existing columns with validation.
- Allow deleting only empty custom columns.
- Protect default columns from deletion.
- Enforce case-insensitive uniqueness and non-empty naming rules.
- Keep implementation scoped to UI + mock-backed state.

## Non-Goals
- Manual column reorder interactions.
- Advanced column metadata (WIP limits, policies, permissions).
- Backend/API persistence.
- Changes to card lifecycle behavior beyond constraints needed for delete-empty checks.

## Domain Rules
Column name rules:
- `trim(name).length >= 1`
- Unique across board using case-insensitive comparison.

Deletion rules:
- Default columns `Todo`, `Doing`, `Done` are protected.
- Custom column can be deleted only when it has zero cards.

## Interaction Design

### Create Column
1. User enters new column name.
2. Validate non-empty and uniqueness.
3. If valid, create custom column.
4. Persist state in mock-backed layer.

### Rename Column
1. User edits target column name.
2. Validate non-empty and uniqueness.
3. If valid, update name in place.
4. Persist state in mock-backed layer.

### Delete Column
1. User requests column deletion.
2. Guard checks:
   - reject if column is protected default
   - reject if column contains cards
3. If custom and empty, delete column.
4. Persist state in mock-backed layer.

## State Management Strategy
- Use one consistent mutation pathway for column operations to avoid rule drift.
- Keep validations centralized so create and rename share identical name constraints.
- Evaluate card count at delete time to enforce empty-only deletion.

## Error and Feedback Strategy
- Invalid create/rename inputs show immediate validation feedback.
- Protected or non-empty delete attempts show clear action-blocked feedback.
- Failed operations keep current board state unchanged.

## Edge Case Handling
- Name differs only by case (`Review` vs `review`) -> treated as duplicate.
- Rename to current value with same normalized name -> no-op or accept without side effects.
- Attempt to delete `Todo`/`Doing`/`Done` -> blocked.
- Empty custom column delete succeeds even when other columns contain cards.

## Testability Notes
Required coverage should include:
- create valid / create invalid (empty, duplicate)
- rename valid / rename invalid (empty, duplicate)
- delete empty custom column
- block delete non-empty custom column
- block delete protected default column
- persistence consistency in mock-backed rehydration

## Risks and Mitigations
- **Risk:** Inconsistent validation between create and rename.
  - **Mitigation:** shared validation helper for normalized-name checks.
- **Risk:** Accidental deletion of workflow-critical columns.
  - **Mitigation:** explicit protected-column guard before delete logic.
- **Risk:** Scope creep into reorder/advanced policies.
  - **Mitigation:** keep those concerns explicitly out of scope in artifacts and tasks.
