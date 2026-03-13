## 1. Reorder Contract Foundation

- [x] 1.1 Add in-column reorder operation contract using `columnId`, `sourceIndex`, and `destinationIndex`.
- [x] 1.2 Enforce same-column scope for reorder behavior in this change.
- [x] 1.3 Preserve task identity and payload across valid reorder operations.

## 2. Reorder Validation Rules

- [x] 2.1 Validate source index is within bounds before applying reorder.
- [x] 2.2 Validate destination index is within bounds before applying reorder.
- [x] 2.3 Treat `sourceIndex === destinationIndex` as no-op with no state mutation.
- [x] 2.4 Reject invalid reorder requests without changing board state.

## 3. Deterministic Ordering Behavior

- [x] 3.1 Implement upward reorder behavior (higher index to lower index) with deterministic resulting order.
- [x] 3.2 Implement downward reorder behavior (lower index to higher index) with deterministic resulting order.
- [x] 3.3 Ensure non-target columns remain unchanged during in-column reorder.

## 4. Scope Boundary Protection

- [x] 4.1 Keep reorder requirements implementation-agnostic (do not hard-require DnD mechanism).
- [x] 4.2 Ensure existing cross-column movement semantics remain unchanged.
- [x] 4.3 Exclude persistence behavior changes from this change scope.

## 5. Verification and Test Coverage

- [x] 5.1 Add test for valid upward in-column reorder outcome.
- [x] 5.2 Add test for valid downward in-column reorder outcome.
- [x] 5.3 Add test for same-index no-op behavior.
- [x] 5.4 Add tests for out-of-range source and destination rejection.
- [x] 5.5 Add test ensuring task identity is preserved after reorder.
- [x] 5.6 Add test ensuring non-target columns are unaffected.

## 6. Quality Checks

- [x] 6.1 Run lint/typecheck/tests for affected modules.
- [x] 6.2 Validate change artifacts and confirm apply-readiness.
