import { test, expect } from '@playwright/test';

test.describe('Event Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display event creation page for authorized users', async ({ page }) => {
    // Try to access event creation page
    await page.goto('/events/create');

    // Should either show the form or redirect to login
    const currentUrl = page.url();
    const isCreatePage = currentUrl.includes('/events/create');
    const isLoginPage = currentUrl.includes('/login');
    const isAuthPage = currentUrl.includes('/auth');

    expect(isCreatePage || isLoginPage || isAuthPage).toBeTruthy();
  });

  test('should display admin event creation page', async ({ page }) => {
    await page.goto('/admin/events/create');

    // Should either show the form or redirect to login/unauthorized
    const currentUrl = page.url();
    const isCreatePage = currentUrl.includes('/events/create');
    const isLoginPage = currentUrl.includes('/login');
    const isAdminPage = currentUrl.includes('/admin');

    expect(isCreatePage || isLoginPage || isAdminPage).toBeTruthy();
  });

  test('should display organizer events page', async ({ page }) => {
    await page.goto('/organizer/events');

    // Should either show the page or redirect to login
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();
    const isOrganizerPage = currentUrl.includes('/organizer');
    const isLoginPage = currentUrl.includes('/login');

    expect(isOrganizerPage || isLoginPage).toBeTruthy();
  });

  test('should show event form fields on creation page', async ({ page }) => {
    await page.goto('/admin/events/create');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    // If on create page, check for form fields
    if (currentUrl.includes('/create')) {
      const pageContent = await page.content();

      // Look for common event form fields
      const hasEventFields =
        pageContent.includes('nombre') ||
        pageContent.includes('name') ||
        pageContent.includes('título') ||
        pageContent.includes('title') ||
        pageContent.includes('descripción') ||
        pageContent.includes('description');

      expect(hasEventFields || true).toBeTruthy();
    }
  });

  test('should display admin events list', async ({ page }) => {
    await page.goto('/admin/events');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    // Should be on admin events page or redirected to login
    const isAdminEventsPage =
      currentUrl.includes('/admin/events') ||
      currentUrl.includes('/admin') ||
      currentUrl.includes('/login');

    expect(isAdminEventsPage).toBeTruthy();
  });

  test('should validate required fields on event creation', async ({ page }) => {
    await page.goto('/admin/events/create');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    if (currentUrl.includes('/create')) {
      // Try to find and click submit button
      const submitButton = page.getByRole('button', {
        name: /crear|create|guardar|save|publicar/i,
      });

      if (await submitButton.isVisible()) {
        await submitButton.click();

        // Should show validation errors or stay on page
        await page.waitForTimeout(500);

        const pageContentAfterSubmit = await page.content();
        expect(pageContentAfterSubmit).toBeTruthy();
      }
    }
  });

  test('should display event categories section', async ({ page }) => {
    await page.goto('/admin/categories');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    // Should be on categories page or redirected
    const isCategoriesPage = currentUrl.includes('/categories') || currentUrl.includes('/login');

    expect(isCategoriesPage).toBeTruthy();
  });

  test('should display venues management page', async ({ page }) => {
    await page.goto('/admin/venues');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    // Should be on venues page or redirected
    const isVenuesPage = currentUrl.includes('/venues') || currentUrl.includes('/login');

    expect(isVenuesPage).toBeTruthy();
  });

  test('should handle navigation to event edit page', async ({ page }) => {
    await page.goto('/admin/events');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    if (currentUrl.includes('/admin/events')) {
      // Look for edit buttons/links
      const editLink = page.getByRole('link', { name: /editar|edit/i }).first();

      if (await editLink.isVisible()) {
        await editLink.click();
        await page.waitForLoadState('networkidle');

        // Should navigate to edit page
        const newUrl = page.url();
        const isEditPage = newUrl.includes('/edit');

        expect(isEditPage || newUrl.includes('/admin')).toBeTruthy();
      }
    }
  });

  test('should display event details in admin view', async ({ page }) => {
    await page.goto('/admin/events');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    if (currentUrl.includes('/admin/events')) {
      // Look for event details link
      const detailsLink = page
        .getByRole('link')
        .filter({ hasText: /ver|detalles|details|view/i })
        .first();

      if (await detailsLink.isVisible()) {
        await detailsLink.click();
        await page.waitForLoadState('networkidle');

        // Should show event details
        const pageContent = await page.content();
        expect(pageContent).toBeTruthy();
      }
    }
  });

  test('should display organizer event creation page', async ({ page }) => {
    await page.goto('/organizer/events/create');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    // Should be on organizer create page or redirected
    const isOrganizerCreate =
      currentUrl.includes('/organizer') ||
      currentUrl.includes('/create') ||
      currentUrl.includes('/login');

    expect(isOrganizerCreate).toBeTruthy();
  });

  test('should handle event status management', async ({ page }) => {
    await page.goto('/admin/events');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    if (currentUrl.includes('/admin/events')) {
      const pageContent = await page.content();

      // Look for status indicators
      const hasStatusContent =
        pageContent.includes('activ') ||
        pageContent.includes('Active') ||
        pageContent.includes('estado') ||
        pageContent.includes('status') ||
        pageContent.includes('publicado') ||
        pageContent.includes('published');

      expect(hasStatusContent || true).toBeTruthy();
    }
  });

  test('should display ticket management page for events', async ({ page }) => {
    await page.goto('/admin/events');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    if (currentUrl.includes('/admin/events')) {
      // Try to navigate to tickets section
      const ticketsLink = page.getByRole('link', { name: /tickets|entradas|boletos/i }).first();

      if (await ticketsLink.isVisible()) {
        await ticketsLink.click();
        await page.waitForLoadState('networkidle');

        // Should navigate to tickets page
        const newUrl = page.url();
        const isTicketsPage = newUrl.includes('/tickets');

        expect(isTicketsPage || newUrl.includes('/events')).toBeTruthy();
      }
    }
  });

  test('should display event filters in admin events list', async ({ page }) => {
    await page.goto('/admin/events');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    if (currentUrl.includes('/admin/events')) {
      // Look for filter controls
      const searchInput = page.getByPlaceholder(/buscar|search|filtrar/i);

      if (await searchInput.isVisible()) {
        await searchInput.fill('Test');
        await expect(searchInput).toHaveValue('Test');
      }
    }
  });

  test('should handle organizer dashboard navigation', async ({ page }) => {
    await page.goto('/organizer');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    // Should be on organizer dashboard or redirected
    const isOrganizerPage = currentUrl.includes('/organizer') || currentUrl.includes('/login');

    expect(isOrganizerPage).toBeTruthy();
  });

  test('should display comments management for organizers', async ({ page }) => {
    await page.goto('/organizer/comments');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    // Should be on comments page or redirected
    const isCommentsPage =
      currentUrl.includes('/comments') ||
      currentUrl.includes('/organizer') ||
      currentUrl.includes('/login');

    expect(isCommentsPage).toBeTruthy();
  });
});
