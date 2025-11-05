import { test, expect } from '@playwright/test';

test('placeholder test', async ({ page }) => {
  // This is a placeholder test to prevent Playwright from failing when no tests are found.
  // The test passes if the page title is not empty.
  await page.goto('/');
  const title = await page.title();
  expect(title).not.toBe('');
});
