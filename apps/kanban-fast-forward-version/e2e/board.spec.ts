import { test, expect } from '@playwright/test'

// ─── Board creation and access ──────────────────────────────────────────────

test.describe('Board creation and access', () => {
  test('create board with valid name: board appears in board list', async ({ page }) => {
    // Arrange
    await page.goto('/')

    // Act
    await page.getByTestId('board-name-input').fill('My Project')
    await page.getByTestId('create-board-btn').click()

    // Assert
    await expect(page.getByTestId('board-list')).toContainText('My Project')
  })

  test('reject empty board name: validation message shown', async ({ page }) => {
    // Arrange
    await page.goto('/')

    // Act
    await page.getByTestId('board-name-input').fill('')
    await page.getByTestId('create-board-btn').click()

    // Assert
    await expect(page.getByTestId('board-name-error')).toBeVisible()
  })
})

// ─── Task ordering and movement ──────────────────────────────────────────────

test.describe('Task ordering and movement', () => {
  test('move task to another column: task appears in target column', async ({ page }) => {
    // Arrange
    await page.goto('/')
    await page.getByTestId('board-name-input').fill('Move Board')
    await page.getByTestId('create-board-btn').click()
    await page.getByTestId('board-list').getByTestId('board-item').filter({ hasText: 'Move Board' }).click()

    // Add a task to the "Todo" column
    await page.getByTestId('column-Todo').getByTestId('add-task-input').fill('Task A')
    await page.getByTestId('column-Todo').getByTestId('add-task-btn').click()

    // Act — reveal move targets then move the task from Todo → Doing
    await page.getByTestId('column-Todo').getByTestId('task-item').first().getByTestId('move-task-btn').click()
    await page.getByTestId('column-Todo').getByTestId('task-item').first().getByTestId('move-to-Doing').click()

    // Assert
    await expect(page.getByTestId('column-Doing').getByTestId('task-item').first()).toContainText('Task A')
    await expect(page.getByTestId('column-Todo').getByTestId('task-item')).toHaveCount(0)
  })
})

// ─── Local-first persistence ──────────────────────────────────────────────────

test.describe('Local-first persistence', () => {
  test('data survives refresh: boards and tasks restored after page reload', async ({ page }) => {
    // Arrange — create board and task
    await page.goto('/')
    await page.getByTestId('board-name-input').fill('Persistent Board')
    await page.getByTestId('create-board-btn').click()
    await page.getByTestId('board-list').getByTestId('board-item').filter({ hasText: 'Persistent Board' }).click()
    await page.getByTestId('column-Todo').getByTestId('add-task-input').fill('Survive Task')
    await page.getByTestId('column-Todo').getByTestId('add-task-btn').click()

    // Act — reload the page
    await page.reload()

    // Assert — board and task are still present
    await expect(page.getByTestId('board-list')).toContainText('Persistent Board')
    await page.getByTestId('board-list').getByTestId('board-item').filter({ hasText: 'Persistent Board' }).click()
    await expect(page.getByTestId('column-Todo').getByTestId('task-item').first()).toContainText('Survive Task')
  })
})
