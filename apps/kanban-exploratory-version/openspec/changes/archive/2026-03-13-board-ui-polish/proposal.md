## Why

The board view is functional but renders as unstyled HTML — columns stack vertically, cards have no visual separation, metadata badges are invisible, and the dark mode toggle has no visual effect. A polished UI is required before the app can be usefully evaluated or demoed.

## What Changes

- Install Tailwind CSS v4 via `@tailwindcss/vite` and configure for the project.
- Restyle `BoardView` so columns render in a horizontal flex row with scroll, each column as a distinct card-like panel.
- Restyle task cards with rounded borders, subtle shadows, and visible metadata badges (labels, due date, priority, description indicator).
- Fix dark mode: update `index.css` to apply the dark color palette when `data-theme="dark"` is set on `<html>` (the store already sets this attribute; the CSS currently only responds to `prefers-color-scheme`).
- Keep all existing `data-testid` attributes — no test regressions.

## Capabilities

### New Capabilities

- `board-ui`: Visual layout and styling requirements for the board view — horizontal column layout, card presentation, metadata badge display, and dark mode behavior.

### Modified Capabilities

- None.

## Impact

- Adds Tailwind CSS v4 as a dev dependency (`tailwindcss`, `@tailwindcss/vite`).
- Updates `vite.config.ts` to register the Tailwind Vite plugin.
- Updates `src/index.css` to import Tailwind and fix the dark mode selector.
- Restyling is additive — all existing `data-testid` selectors and functional behavior are preserved.
- No store, type, or test logic changes required.
