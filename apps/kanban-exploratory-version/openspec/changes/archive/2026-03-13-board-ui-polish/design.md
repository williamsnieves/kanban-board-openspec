## Context

The board view (`BoardView.tsx`) and card rendering are functionally complete but have zero visual styling — all output is plain HTML. The project uses CSS custom properties defined in `index.css` for colors, but no layout or component styles exist. The theme store correctly sets `data-theme="dark"` on `<html>`, but `index.css` only applies the dark palette via `@media (prefers-color-scheme: dark)`, ignoring the attribute entirely.

Tailwind CSS is not installed. The project uses Vite + React + TypeScript.

Constraints:
- All existing `data-testid` attributes must be preserved — no test regressions.
- No changes to store logic, types, or business rules.
- Keep component files modular; avoid a single 600-line styled component.

## Goals / Non-Goals

**Goals:**
- Install Tailwind CSS v4 via `@tailwindcss/vite` plugin (zero-config approach for Vite).
- Achieve a horizontal Kanban layout: columns side-by-side in a scrollable flex row.
- Style task cards with visual boundaries (rounded corners, shadow, padding).
- Show metadata badges on cards using colored inline elements (labels, due date, priority, description indicator).
- Fix dark mode: `index.css` must apply the dark color palette when `html[data-theme="dark"]` is present.

**Non-Goals:**
- Animation or transitions.
- Responsive mobile layout.
- Custom design tokens beyond what's needed for the above.
- Restyling the dashboard / board list page.
- Component extraction or refactoring beyond applying Tailwind classes.

## Decisions

### 1. Tailwind CSS v4 via `@tailwindcss/vite`
- **Decision:** Use the Vite-native Tailwind v4 plugin (`@tailwindcss/vite`) instead of the PostCSS pipeline.
- **Rationale:** Zero-config setup for Vite projects — no `tailwind.config.js`, no PostCSS config. Single plugin line in `vite.config.ts` and one `@import "tailwindcss"` in `index.css`.
- **Alternative considered:** Tailwind v3 with PostCSS. Rejected — requires more config files and the v4 integration is cleaner for this project.

### 2. Apply Tailwind classes directly in JSX (no CSS Modules)
- **Decision:** Add Tailwind utility classes directly to JSX elements in `BoardView.tsx` and `CardDetailModal.tsx`.
- **Rationale:** Fastest path to styled output without introducing new file types. The components are already written; adding classes inline keeps changes minimal.
- **Alternative considered:** CSS Modules per component. Rejected — more files, more setup, more scope.

### 3. Dark mode via `html[data-theme="dark"]` selector
- **Decision:** In `index.css`, add a `html[data-theme="dark"]` block that overrides CSS variables alongside the existing `@media (prefers-color-scheme: dark)` block.
- **Rationale:** The theme store already sets the attribute. This fix requires one CSS rule addition — no JS changes needed.
- **Alternative considered:** Use Tailwind's `dark:` variant with `darkMode: 'selector'`. Deferred — adds config complexity; the CSS variable approach works with minimal change and is already partially established.

### 4. Kanban layout: horizontal scroll container
- **Decision:** Wrap `displayColumns` in a `flex flex-row gap-4 overflow-x-auto` container. Each column gets a fixed width (`w-72`) so columns don't shrink.
- **Rationale:** Standard Kanban UX pattern. Overflow-x scroll handles any number of columns gracefully.

### 5. Metadata badges as colored `<span>` elements
- **Decision:** Labels use small colored pill spans (one color per label name). Due date shown with a calendar prefix. Priority shown with a colored dot/text. Description indicator shown as a small icon character.
- **Rationale:** No icon library dependency needed. Consistent with the existing plain-text metadata indicators already in the JSX.

## Risks / Trade-offs

- [Risk] Tailwind v4 is recent — API may differ from user expectations if they know v3. → Mitigation: only use stable utility classes (flex, grid, padding, colors, rounded, shadow).
- [Risk] Applying classes to `BoardView.tsx` (already 397 lines) increases file size further. → Mitigation: acceptable for exploratory phase; extraction is a future concern.
- [Risk] `data-theme` dark mode fix coexists with `prefers-color-scheme` — if OS is dark and user toggles to light, both selectors would fight. → Mitigation: Give `html[data-theme]` higher specificity or use `:where()` to avoid the conflict. Document as known behavior.

## Migration Plan

1. Install: `npm install -D tailwindcss @tailwindcss/vite`
2. Update `vite.config.ts`: add `tailwindcss()` to plugins.
3. Update `index.css`: add `@import "tailwindcss"` at top; add `html[data-theme="dark"]` CSS variable overrides.
4. Apply Tailwind classes to `BoardView.tsx` — layout, columns, cards, badges.
5. Apply Tailwind classes to `CardDetailModal.tsx` — modal overlay, panel.
6. Run `npx vitest run` to confirm no regressions (no test changes expected).

No rollback complexity — CSS changes are purely additive to existing markup.
