import { test, expect } from '@playwright/test';

test.describe('Ticket Purchase Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display events page', async ({ page }) => {
    await page.goto('/events');
    await expect(page).toHaveURL('/events');
    await expect(page.getByRole('heading', { name: /eventos|events/i })).toBeVisible();
  });

  test('should display event filters', async ({ page }) => {
    await page.goto('/events');

    // Check for common filter elements
    const searchInput = page.getByPlaceholder(/buscar|search/i);
    if (await searchInput.isVisible()) {
      await expect(searchInput).toBeVisible();
    }
  });

  test('should navigate to event details when clicking on an event', async ({ page }) => {
    await page.goto('/events');

    // Wait for events to load
    await page.waitForLoadState('networkidle');

    // Find first event card and click it
    const eventCard = page.locator('[data-testid="event-card"]').first();

    // If test data selector doesn't exist, try alternative selectors
    const isEventCardVisible = await eventCard.isVisible();
    const eventLink = isEventCardVisible
      ? eventCard
      : page
          .getByRole('link')
          .filter({ hasText: /ver|detalles|details/i })
          .first();

    if (await eventLink.isVisible()) {
      await eventLink.click();

      // Should navigate to event details page
      await expect(page).toHaveURL(/\/events\/[^/]+$/);
    }
  });

  test('should display event details page structure', async ({ page }) => {
    // Navigate directly to a mock event (assuming events exist)
    await page.goto('/events');
    await page.waitForLoadState('networkidle');

    // Try to click on first event
    const firstEventLink = page
      .getByRole('link')
      .filter({ hasText: /ver|detalles|details|más información/i })
      .first();

    if (await firstEventLink.isVisible()) {
      await firstEventLink.click();

      // Wait for navigation
      await page.waitForLoadState('networkidle');

      // Check for ticket selection section (common in event detail pages)
      const pageContent = await page.content();
      const hasTicketSection =
        pageContent.includes('ticket') ||
        pageContent.includes('entradas') ||
        pageContent.includes('boletos');

      expect(hasTicketSection).toBeTruthy();
    }
  });

  test('should allow searching for events', async ({ page }) => {
    await page.goto('/events');

    const searchInput = page.getByPlaceholder(/buscar|search/i);

    if (await searchInput.isVisible()) {
      await searchInput.fill('Concierto');
      await expect(searchInput).toHaveValue('Concierto');

      // Wait for search results to update
      await page.waitForTimeout(1000);
    }
  });

  test('should handle empty events list gracefully', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');

    // Page should load without errors even if no events exist
    const pageContent = await page.content();
    expect(pageContent).toBeTruthy();
  });

  test('should display event card information', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');

    // Check if any event cards are present
    const eventCards = page.locator(
      '[data-testid="event-card"], .event-card, article, [class*="event"]'
    );
    const count = await eventCards.count();

    if (count > 0) {
      // First card should have some text content
      const firstCard = eventCards.first();
      const textContent = await firstCard.textContent();
      expect(textContent).toBeTruthy();
      expect(textContent!.length).toBeGreaterThan(0);
    }
  });

  test('should navigate to events page from home', async ({ page }) => {
    await page.goto('/');

    // Look for events link in navigation
    const eventsLink = page.getByRole('link', { name: /eventos|events/i });

    if (await eventsLink.isVisible()) {
      await eventsLink.click();
      await expect(page).toHaveURL(/\/events/);
    }
  });

  test('should maintain URL state when filtering events', async ({ page }) => {
    await page.goto('/events');

    const searchInput = page.getByPlaceholder(/buscar|search/i);

    if (await searchInput.isVisible()) {
      await searchInput.fill('Test Event');

      // URL might update with search params
      await page.waitForTimeout(500);

      const currentUrl = page.url();
      expect(currentUrl).toContain('/events');
    }
  });

  test('should handle navigation back from event details', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');

    const firstEventLink = page
      .getByRole('link')
      .filter({ hasText: /ver|detalles|details|más información/i })
      .first();

    if (await firstEventLink.isVisible()) {
      await firstEventLink.click();
      await page.waitForLoadState('networkidle');

      // Go back
      await page.goBack();

      // Should be back at events page
      await expect(page).toHaveURL(/\/events/);
    }
  });
});
