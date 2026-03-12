import { test, expect, type Page, type Locator } from '@playwright/test';

// ── Helpers ──────────────────────────────────────────────────────────────────

async function clearState(page: Page) {
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
}

async function createAndSelectBoard(page: Page, name: string) {
  await page.getByTestId('board-name-input').fill(name);
  await page.getByTestId('create-board-btn').click();
  await page
    .getByTestId('board-list')
    .getByTestId('board-item')
    .filter({ hasText: name })
    .click();
}

async function addTask(page: Page, columnName: string, title: string) {
  const col = page.getByTestId(`droppable-column-${columnName}`);
  await col.getByTestId('add-task-input').fill(title);
  await col.getByTestId('add-task-btn').click();
}

/** Simulate a pointer-based drag from source to target (works with @dnd-kit PointerSensor). */
async function dragTo(page: Page, source: Locator, target: Locator) {
  const srcBox = await source.boundingBox();
  const tgtBox = await target.boundingBox();
  if (!srcBox || !tgtBox) throw new Error('dragTo: could not get bounding box');

  const sx = srcBox.x + srcBox.width / 2;
  const sy = srcBox.y + srcBox.height / 2;
  const tx = tgtBox.x + tgtBox.width / 2;
  const ty = tgtBox.y + tgtBox.height / 2;

  await page.mouse.move(sx, sy);
  await page.mouse.down();
  // Small nudge to pass @dnd-kit activation distance
  await page.mouse.move(sx + 4, sy + 4, { steps: 4 });
  // Glide to target
  await page.mouse.move(tx, ty, { steps: 20 });
  await page.mouse.up();
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe('DnD Interaction - Core Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearState(page);
  });

  // Flow 1 ────────────────────────────────────────────────────────────────────
  test('same-column reorder: drag task from position 0 to position 1', async ({ page }) => {
    // Arrange
    await createAndSelectBoard(page, 'Reorder Board');
    await addTask(page, 'Todo', 'Task A');
    await addTask(page, 'Todo', 'Task B');

    const todoCol = page.getByTestId('droppable-column-Todo');
    const cards = todoCol.getByTestId('task-card');

    await expect(cards.first()).toContainText('Task A');
    await expect(cards.nth(1)).toContainText('Task B');

    // Act — click the ↓ button on Task A (position 0 → 1)
    // Same-column reorder via DnD is not in scope of handleDragEnd;
    // the ↓ button exercises the reorderTask store action directly.
    await cards.first().getByTestId('task-move-down').click();

    // Assert — Task B is now at position 0, Task A at position 1
    await expect(cards.first()).toContainText('Task B');
    await expect(cards.nth(1)).toContainText('Task A');
  });

  // Flow 2 ────────────────────────────────────────────────────────────────────
  test('cross-column move: drag task from column A to column B', async ({ page }) => {
    // Arrange
    await createAndSelectBoard(page, 'Cross Board');
    await addTask(page, 'Todo', 'Move Me');

    const todoCol = page.getByTestId('droppable-column-Todo');
    const doingCol = page.getByTestId('droppable-column-Doing');

    await expect(todoCol.getByTestId('task-card')).toHaveCount(1);
    await expect(doingCol.getByTestId('task-card')).toHaveCount(0);

    // Act — drag the drag handle from Todo into the Doing droppable column
    const dragHandle = todoCol.getByTestId('drag-handle').first();
    await dragTo(page, dragHandle, doingCol);

    // Assert — task is in Doing, removed from Todo
    await expect(doingCol.getByTestId('task-card')).toHaveCount(1);
    await expect(doingCol.getByTestId('task-card').first()).toContainText('Move Me');
    await expect(todoCol.getByTestId('task-card')).toHaveCount(0);
  });

  // Flow 3 ────────────────────────────────────────────────────────────────────
  test('invalid-drop rollback: releasing over non-column area preserves original state', async ({ page }) => {
    // Arrange
    await createAndSelectBoard(page, 'Rollback Board');
    await addTask(page, 'Todo', 'Stay Here');

    const todoCol = page.getByTestId('droppable-column-Todo');
    await expect(todoCol.getByTestId('task-card')).toHaveCount(1);

    // Act — drag handle to far-right of viewport (x=1200), past all registered
    // droppable columns (which end ~964px in a 1280px viewport). @dnd-kit's
    // rectIntersection collision algorithm will find event.over = null, so
    // handleDragEnd returns early and the task stays in its original column.
    const dragHandle = todoCol.getByTestId('drag-handle').first();
    const srcBox = await dragHandle.boundingBox();
    const sx = srcBox!.x + srcBox!.width / 2;
    const sy = srcBox!.y + srcBox!.height / 2;

    await page.mouse.move(sx, sy);
    await page.mouse.down();
    await page.mouse.move(sx + 4, sy + 4, { steps: 4 });
    await page.mouse.move(1220, sy, { steps: 20 }); // past all droppable columns
    await page.mouse.up();

    // Assert — task is still in Todo; no task leaked to other columns
    await expect(todoCol.getByTestId('task-card')).toHaveCount(1);
    await expect(todoCol.getByTestId('task-card').first()).toContainText('Stay Here');
    await expect(page.getByTestId('droppable-column-Doing').getByTestId('task-card')).toHaveCount(0);
    await expect(page.getByTestId('droppable-column-Done').getByTestId('task-card')).toHaveCount(0);
  });

  // Flow 4 ────────────────────────────────────────────────────────────────────
  test('keyboard fallback: ArrowDown reorders task down', async ({ page }) => {
    // Arrange
    await createAndSelectBoard(page, 'Keyboard Board');
    await addTask(page, 'Todo', 'First Task');
    await addTask(page, 'Todo', 'Second Task');

    const todoCol = page.getByTestId('droppable-column-Todo');
    const cards = todoCol.getByTestId('task-card');

    await expect(cards.first()).toContainText('First Task');
    await expect(cards.nth(1)).toContainText('Second Task');

    // Act — focus the first task card and press ArrowDown
    await cards.first().focus();
    await page.keyboard.press('ArrowDown');

    // Assert — First Task is now at position 1
    await expect(cards.first()).toContainText('Second Task');
    await expect(cards.nth(1)).toContainText('First Task');
  });
});
