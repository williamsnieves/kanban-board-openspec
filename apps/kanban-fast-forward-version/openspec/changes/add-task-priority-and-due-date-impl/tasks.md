## 1. Traceability Matrix Setup

- [ ] 1.1 Build requirement→scenario→test matrix for priority scenarios (valid creation, invalid value rejection) and register initial failing test targets
- [ ] 1.2 Build requirement→scenario→test matrix for due date scenarios (create with date, edit/clear date) and register initial failing test targets
- [ ] 1.3 Build requirement→scenario→test matrix for due date validation + card display scenarios and register initial failing test targets
- [ ] 1.4 Build requirement→scenario→test matrix for persistence + scope-boundary scenarios and register initial failing test targets

## 2. Atomic Execution Slices (Per Scenario)

- [ ] 2.1 Execute priority-valid creation slice: failing test first, minimal implementation, passing evidence, reviewer validation
- [ ] 2.2 Execute priority-invalid rejection slice: failing test first, minimal implementation, passing evidence, reviewer validation
- [ ] 2.3 Execute due-date create/edit/clear slice: failing test first, minimal implementation, passing evidence, reviewer validation
- [ ] 2.4 Execute invalid-date validation slice: failing test first, minimal implementation, passing evidence, reviewer validation
- [ ] 2.5 Execute task-card metadata display slice: failing test first, minimal implementation, passing evidence, reviewer validation
- [ ] 2.6 Execute metadata persistence-after-reload slice: failing test first, minimal implementation, passing evidence, reviewer validation
- [ ] 2.7 Execute legacy-priority defaulting slice (missing priority defaults to medium): failing test first, minimal implementation, passing evidence, reviewer validation
- [ ] 2.8 Execute out-of-scope guard slice (no reminders/notifications/filtering/backend/overdue visuals): failing test first, minimal implementation, passing evidence, reviewer validation

## 3. Verify and Closure Gates

- [ ] 3.1 Run apply evidence review: each completed slice includes failing→passing proof and touched files list
- [ ] 3.2 Run verify gate against contract + acceptance checklist and confirm no unresolved requirement→scenario→test mapping
- [ ] 3.3 Confirm closure rule: apply completed + verify approved before archive eligibility
