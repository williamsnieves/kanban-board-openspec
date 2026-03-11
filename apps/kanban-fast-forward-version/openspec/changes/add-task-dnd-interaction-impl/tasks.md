## 1. Traceability Matrix Setup

- [ ] 1.1 Build requirement→scenario→test matrix for drag-start scenario and register initial failing test target(s)
- [ ] 1.2 Build requirement→scenario→test matrix for same-column reorder and cross-column move scenarios and register initial failing test target(s)
- [ ] 1.3 Build requirement→scenario→test matrix for valid-highlight and invalid-drop rollback scenarios and register initial failing test target(s)
- [ ] 1.4 Build requirement→scenario→test matrix for keyboard fallback scenario (including boundary no-op cases) and register initial failing test target(s)

## 2. Atomic Execution Slices (Per Scenario)

- [ ] 2.1 Execute drag-start slice: failing test first, minimal implementation, passing evidence, reviewer validation
- [ ] 2.2 Execute same-column reorder slice: failing test first, minimal implementation, passing evidence, reviewer validation
- [ ] 2.3 Execute cross-column move slice: failing test first, minimal implementation, passing evidence, reviewer validation
- [ ] 2.4 Execute valid-target highlight slice: failing test first, minimal implementation, passing evidence, reviewer validation
- [ ] 2.5 Execute invalid-drop rollback slice: failing test first, minimal implementation, passing evidence, reviewer validation
- [ ] 2.6 Execute keyboard fallback movement slice: failing test first, minimal implementation, passing evidence, reviewer validation
- [ ] 2.7 Execute keyboard boundary no-op slice: failing test first, minimal implementation, passing evidence, reviewer validation
- [ ] 2.8 Execute parity slice (keyboard outcome equals equivalent DnD outcome): failing test first, minimal implementation, passing evidence, reviewer validation

## 3. Verify and Closure Gates

- [ ] 3.1 Run apply evidence review: each completed slice shows failing→passing proof and touched files list
- [ ] 3.2 Run verify gate using contract + acceptance checklist and confirm no unresolved traceability mapping
- [ ] 3.3 Confirm closure rule: apply completed + verify approved before archive eligibility
