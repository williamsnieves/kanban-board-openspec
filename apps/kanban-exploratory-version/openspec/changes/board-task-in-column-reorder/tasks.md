## 1. Reorder Contract Foundation

- [ ] 1.1 Add in-column reorder operation contract using `columnId`, `sourceIndex`, and `destinationIndex`.
- [ ] 1.2 Enforce same-column scope for reorder behavior in this change.
- [ ] 1.3 Preserve task identity and payload across valid reorder operations.

## 2. Reorder Validation Rules

- [ ] 2.1 Validate source index is within bounds before applying reorder.
- [ ] 2.2 Validate destination index is within bounds before applying reorder.
- [ ] 2.3 Treat `sourceIndex === destinationIndex` as no-op with no state mutation.
- [ ] 2.4 Reject invalid reorder requests without changing board state.

## 3. Deterministic Ordering Behavior

- [ ] 3.1 Implement upward reorder behavior (higher index to lower index) with deterministic resulting order.
- [ ] 3.2 Implement downward reorder behavior (lower index to higher index) with deterministic resulting order.
- [ ] 3.3 Ensure non-target columns remain unchanged during in-column reorder.

## 4. Scope Boundary Protection

- [ ] 4.1 Keep reorder requirements implementation-agnostic (do not hard-require DnD mechanism).
- [ ] 4.2 Ensure existing cross-column movement semantics remain unchanged.
- [ ] 4.3 Exclude persistence behavior changes from this change scope.

## 5. Verification and Test Coverage

- [ ] 5.1 Add test for valid upward in-column reorder outcome.
- [ ] 5.2 Add test for valid downward in-column reorder outcome.
- [ ] 5.3 Add test for same-index no-op behavior.
- [ ] 5.4 Add tests for out-of-range source and destination rejection.
- [ ] 5.5 Add test ensuring task identity is preserved after reorder.
- [ ] 5.6 Add test ensuring non-target columns are unaffected.

## 6. Quality Checks

- [ ] 6.1 Run lint/typecheck/tests for affected modules.
- [ ] 6.2 Validate change artifacts and confirm apply-readiness.
