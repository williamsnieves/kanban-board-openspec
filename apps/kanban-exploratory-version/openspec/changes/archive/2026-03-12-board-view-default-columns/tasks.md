## 1. UI default column initialization
- [x] 1.1 Create a UI utility/function that derives board columns from mock input data.
- [x] 1.2 Implement canonical default set: `Todo`, `Doing`, `Done`.
- [x] 1.3 Enforce canonical render order: `Todo -> Doing -> Done`.

## 2. Normalization and idempotency
- [x] 2.1 Add case-insensitive matching for default column names (`todo|doing|done`).
- [x] 2.2 Normalize matched labels to canonical display names.
- [x] 2.3 Ensure repeated initialization does not create duplicate default columns.

## 3. Partial and legacy data behavior
- [x] 3.1 When defaults are missing, add only the missing default columns.
- [x] 3.2 Preserve non-default/legacy columns unchanged.
- [x] 3.3 Define deterministic handling for duplicate default variants in source mock data.

## 4. Rendering behavior
- [x] 4.1 Render all default columns even when they have zero tasks.
- [x] 4.2 Add empty-state UI per column without runtime errors.

## 5. Test coverage with mocks
- [x] 5.1 Add test fixture for empty board (no columns).
- [x] 5.2 Add test fixture for partial defaults + extra legacy column.
- [x] 5.3 Add test fixture for mixed-case defaults.
- [x] 5.4 Add test ensuring idempotency across re-render/re-open.
- [x] 5.5 Add test for empty-task rendering across all default columns.

## 6. Quality checks
- [x] 6.1 Run project lint/tests for affected UI modules.
- [x] 6.2 Verify behavior manually in board view using mock scenarios.
