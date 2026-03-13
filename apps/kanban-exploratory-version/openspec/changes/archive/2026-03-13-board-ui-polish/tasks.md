## 1. Tailwind CSS Setup

- [x] 1.1 Install `tailwindcss` and `@tailwindcss/vite` as dev dependencies.
- [x] 1.2 Register the Tailwind Vite plugin in `vite.config.ts`.
- [x] 1.3 Add `@import "tailwindcss"` at the top of `src/index.css`.

## 2. Dark Mode Fix

- [x] 2.1 Add `html[data-theme="dark"]` CSS variable overrides in `index.css` so the dark palette applies when the toggle is activated (mirror the existing `@media (prefers-color-scheme: dark)` block).
- [x] 2.2 Verify the dark mode toggle in `BoardView` switches the board visually between light and dark.

## 3. Board Layout

- [x] 3.1 Apply horizontal flex row layout to the columns container in `BoardView.tsx` (`flex flex-row gap-4 overflow-x-auto`).
- [x] 3.2 Apply fixed width and vertical flex layout to each column panel (`w-72 flex-shrink-0 flex flex-col`).
- [x] 3.3 Style each column header (name, controls) with padding and a subtle background.
- [x] 3.4 Style the task list area inside each column with vertical spacing between cards.

## 4. Task Card Styles

- [x] 4.1 Apply card styles to each task item: background, rounded corners, padding, and shadow.
- [x] 4.2 Add hover state to cards (e.g., `hover:shadow-md` or border color change).
- [x] 4.3 Ensure the card title and action controls (edit, delete, move select) are visually organized inside the card.

## 5. Metadata Badges

- [x] 5.1 Style existing `card-labels-{id}` indicator as colored pill badges (one color per label: bug=red, feature=blue, urgent=orange, enhancement=green).
- [x] 5.2 Style existing `card-due-date-{id}` indicator with a calendar prefix and small text.
- [x] 5.3 Style existing `card-priority-{id}` indicator with a colored dot or badge (low=gray, medium=yellow, high=red).
- [x] 5.4 Style existing `card-description-indicator-{id}` as a small muted icon or text badge.
- [x] 5.5 Ensure badges are hidden (not rendered) when their corresponding field is empty — confirm existing conditional rendering is correct.

## 6. Card Detail Modal Styles

- [x] 6.1 Apply modal overlay backdrop (`fixed inset-0 bg-black/50 flex items-center justify-center`).
- [x] 6.2 Apply modal panel styles: white/dark background, rounded corners, shadow, max width, overflow scroll.
- [x] 6.3 Style tab buttons (Details / Checklist / Activity) with active state indicator.

## 7. Verification

- [x] 7.1 Run `npx vitest run` — all existing tests must pass (no regressions from styling changes).
- [x] 7.2 Run `npx tsc --noEmit` — no type errors.
- [x] 7.3 Visually verify in browser: columns display horizontally with scroll.
- [x] 7.4 Visually verify dark mode toggle switches theme correctly.
- [x] 7.5 Visually verify metadata badges appear on cards when fields are set.
