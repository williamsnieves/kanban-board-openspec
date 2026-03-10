import { test, expect } from '@playwright/test'

test.describe('Playwright E2E baseline', () => {
  test('initial E2E smoke test passes: app boots and main root view is reachable', async ({ page }) => {
    // Arrange
    // baseURL is configured in playwright.config.ts as http://localhost:5173
    // webServer auto-starts npm run dev — no manual start needed

    // Act
    await page.goto('/')

    // Assert
    await expect(page.getByRole('heading', { name: /vite \+ react/i })).toBeVisible()
  })
})
