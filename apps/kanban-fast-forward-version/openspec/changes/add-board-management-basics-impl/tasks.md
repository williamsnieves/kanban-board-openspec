## 1. Traceability Matrix Setup

- [ ] 1.1 Build requirement→scenario→test matrix for board rename scenarios and record initial failing test target(s)
- [ ] 1.2 Build requirement→scenario→test matrix for board delete scenarios and record initial failing test target(s)
- [ ] 1.3 Build requirement→scenario→test matrix for empty-state scenarios (zero boards, zero tasks) and record initial failing test target(s)
- [ ] 1.4 Build requirement→scenario→test matrix for local-first persistence scenarios and record initial failing test target(s)

## 2. Atomic Execution Slices (Per Scenario)

- [ ] 2.1 Execute rename-valid scenario slice: failing test first, minimal implementation, passing evidence, reviewer validation
- [ ] 2.2 Execute rename-invalid scenario slice: failing test first, minimal implementation, passing evidence, reviewer validation
- [ ] 2.3 Execute delete-confirm scenario slice: failing test first, minimal implementation, passing evidence, reviewer validation
- [ ] 2.4 Execute delete-cancel scenario slice: failing test first, minimal implementation, passing evidence, reviewer validation
- [ ] 2.5 Execute zero-boards empty-state scenario slice: failing test first, minimal implementation, passing evidence, reviewer validation
- [ ] 2.6 Execute zero-tasks empty-state scenario slice: failing test first, minimal implementation, passing evidence, reviewer validation
- [ ] 2.7 Execute persistence-after-rename scenario slice: failing test first, minimal implementation, passing evidence, reviewer validation
- [ ] 2.8 Execute persistence-after-delete scenario slice: failing test first, minimal implementation, passing evidence, reviewer validation

## 3. Verify and Closure Gates

- [ ] 3.1 Run apply evidence review: every completed scenario task shows failing→passing proof and touched files list
- [ ] 3.2 Run verify gate with reviewer checklist and confirm no unresolved scenario in traceability matrix
- [ ] 3.3 Confirm closure rule: apply completed + verify approved before archive eligibility
