# Apply-Phase Handoff — Task Priority and Due Date

> This document is for the implementation team. It summarizes what to build, the resolved open questions, required store and UI changes, data-testid requirements, out-of-scope constraints, and verification instructions.
>
> **References:**
> - Spec: `openspec/changes/add-task-priority-and-due-date/specs/task-priority-and-due-date/spec.md`
> - Contract: `openspec/changes/add-task-priority-and-due-date/task-metadata-contract.md`
> - Acceptance checklist: `openspec/changes/add-task-priority-and-due-date/acceptance-checklist.md`
> - Design: `openspec/changes/add-task-priority-and-due-date/design.md`

---

## 1. Capability Summary

The `add-task-priority-and-due-date` change adds:

- **Priority field on tasks** — a required enum field constrained to `low`, `medium`, or `high`. Invalid values are rejected before any store write.
- **Optional due date field on tasks** — a `YYYY-MM-DD` date-only string, clearable, persisted as part of the task record.
- **Form inputs** — a priority selector and a due date input are added to task create and edit forms.
- **Validation** — deterministic error messages for invalid priority values and invalid date formats; store writes are blocked until valid values are provided.
- **Card display** — task cards display priority and due date metadata when present.
- **Local-first persistence** — both fields are written to and restored from local storage as part of the existing task record structure.

---

## 2. Resolved Open Questions

| Question | Resolution |
|----------|-----------|
| Should `dueDate` store date-only or full timestamp? | **Date-only — `YYYY-MM-DD` format.** No timezone handling required for MVP. |
| Should overdue visual state be included in this change? | **No — deferred to a follow-up spec.** Card display shows the date as text only; no color change or alert for past-due dates. |

---

## 3. Required Store Changes

### Task model extension

Extend the task entity to include two new fields:

| Field | Type | Required | Allowed values / format | Default on missing |
|-------|------|----------|------------------------|--------------------|
| `priority` | `"low" \| "medium" \| "high"` | Yes | `low`, `medium`, `high` only | `"medium"` — applied in memory to legacy records that lack this field |
| `dueDate` | `string \| undefined` | No | `YYYY-MM-DD`, or absent | absent (`undefined`) — omitted from the stored object when not set |

### Validation before state write

Implement a validation layer that runs before any task create or edit write to the store:

1. **Priority validation:** If `priority` is not one of `low | medium | high`, block the write and surface the error at `data-testid="task-priority-error"`.
2. **Due date validation:** If `dueDate` is a non-empty string, check that it matches `YYYY-MM-DD` format and represents a real calendar date. If not, block the write and surface the error at `data-testid="task-due-date-error"`. An absent or empty `dueDate` always passes validation (sets the field to `undefined`).

### Persistence

- Both `priority` and `dueDate` MUST be included in the task record that is written to local storage.
- On application load, both fields MUST be read from local storage and hydrated into the task store without transformation.
- Legacy task records missing `priority` MUST default to `"medium"` in memory (silently, no user action required).
- Legacy task records missing `dueDate` MUST leave `dueDate` as `undefined` (absent) — no default value is applied.

---

## 4. Required UI Changes

### Task Create / Edit Form

| Change | Details |
|--------|---------|
| Add priority selector | A discrete control (dropdown or radio group) with options `low`, `medium`, `high`. `data-testid="task-priority-select"`. |
| Add due date input | A date input accepting `YYYY-MM-DD`. Optional — may be left blank. `data-testid="task-due-date-input"`. |
| Add priority error element | Render at `data-testid="task-priority-error"` when priority validation fails. Hidden when valid. |
| Add due date error element | Render at `data-testid="task-due-date-error"` when due date validation fails. Hidden when valid or empty. |

### Task Card

| Change | Details |
|--------|---------|
| Add priority badge | Render `data-testid="task-priority-badge"` showing the priority value. Always visible (priority is required on every task). |
| Add due date display | Render `data-testid="task-due-date-display"` showing a human-readable date. Render only when `dueDate` is set (not absent/undefined). |

---

## 5. `data-testid` Requirements

| Element | `data-testid` | Notes |
|---------|--------------|-------|
| Priority selector (form) | `task-priority-select` | In create and edit forms |
| Priority validation error | `task-priority-error` | Shown on invalid priority |
| Due date input (form) | `task-due-date-input` | In create and edit forms |
| Due date validation error | `task-due-date-error` | Shown on invalid date format |
| Priority badge (card) | `task-priority-badge` | Always rendered when task has priority |
| Due date display (card) | `task-due-date-display` | Rendered only when `dueDate` is set (not absent/undefined) |

---

## 6. Explicit Out-of-Scope Constraints

The following capabilities MUST NOT be implemented in this change. Any PR that introduces them MUST be rejected.

| Excluded capability | Notes |
|--------------------|-------|
| Reminders | Out of scope per spec Non-Goals |
| Notifications | Out of scope per spec Non-Goals |
| Advanced filtering or sorting by priority / due date | Out of scope per spec Non-Goals |
| Backend API or server-side persistence | Out of scope per spec Non-Goals |
| Overdue visual state (color, icon, alert) | Deferred to follow-up spec |

---

## 7. Verification

Before marking this change as complete, validate all checks in:

**`openspec/changes/add-task-priority-and-due-date/acceptance-checklist.md`**

Key sections:
- **Section 1:** Priority selector renders correctly; valid values stored; invalid values rejected with deterministic error.
- **Section 2:** Due date stored on create; updated on edit; cleared correctly; empty field accepted without error.
- **Section 3:** Invalid date format blocked with deterministic error message; valid and empty inputs pass without error.
- **Section 4:** Priority badge always visible on cards; due date display visible only when `dueDate` is set, absent when undefined.
- **Section 5:** Both fields restored exactly from local storage after page reload.
- **Section 6:** Out-of-scope capabilities (reminders, notifications, filtering, backend, overdue state) are absent.
- **Traceability table:** Every acceptance check maps to a spec requirement and scenario.
