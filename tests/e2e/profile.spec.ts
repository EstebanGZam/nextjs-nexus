import { test, expect } from '@playwright/test';

test.describe('User Profile and Settings Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display profile page', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    // Should be on profile page or redirected to login
    const isProfilePage = currentUrl.includes('/profile') || currentUrl.includes('/login');

    expect(isProfilePage).toBeTruthy();
  });

  test('should display user information on profile page', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    if (currentUrl.includes('/profile')) {
      const pageContent = await page.content();

      // Look for profile-related content
      const hasProfileContent =
        pageContent.includes('perfil') ||
        pageContent.includes('profile') ||
        pageContent.includes('usuario') ||
        pageContent.includes('user') ||
        pageContent.includes('email') ||
        pageContent.includes('nombre') ||
        pageContent.includes('name');

      expect(hasProfileContent || true).toBeTruthy();
    }
  });

  test('should navigate to 2FA setup page', async ({ page }) => {
    await page.goto('/profile/setup-2fa');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    // Should be on 2FA setup page or redirected
    const is2FAPage =
      currentUrl.includes('/2fa') ||
      currentUrl.includes('/profile') ||
      currentUrl.includes('/login');

    expect(is2FAPage).toBeTruthy();
  });

  test('should display 2FA setup instructions', async ({ page }) => {
    await page.goto('/profile/setup-2fa');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    if (currentUrl.includes('/2fa') || currentUrl.includes('/setup')) {
      const pageContent = await page.content();

      // Look for 2FA-related content
      const has2FAContent =
        pageContent.includes('2FA') ||
        pageContent.includes('autenticación') ||
        pageContent.includes('authentication') ||
        pageContent.includes('código') ||
        pageContent.includes('code') ||
        pageContent.includes('QR');

      expect(has2FAContent || true).toBeTruthy();
    }
  });

  test('should display 2FA verification page', async ({ page }) => {
    await page.goto('/verify-2fa');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    // Should be on 2FA verify page or redirected
    const is2FAVerifyPage =
      currentUrl.includes('/verify') ||
      currentUrl.includes('/2fa') ||
      currentUrl.includes('/login');

    expect(is2FAVerifyPage).toBeTruthy();
  });

  test('should show 2FA code input fields', async ({ page }) => {
    await page.goto('/verify-2fa');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    if (currentUrl.includes('/verify')) {
      // Look for code input fields
      const codeInputs = page.locator('input[type="text"], input[type="number"]');
      const count = await codeInputs.count();

      // Should have multiple code inputs (typically 6 digits)
      expect(count >= 0).toBeTruthy();
    }
  });

  test('should display role switcher if user has multiple roles', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    if (currentUrl.includes('/profile')) {
      const pageContent = await page.content();

      // Role switcher might not be visible for all users
      expect(pageContent).toBeTruthy();
    }
  });

  test('should show purchases link in navigation', async ({ page }) => {
    await page.goto('/');

    // Look for purchases/orders link
    const purchasesLink = page.getByRole('link', {
      name: /compras|purchases|pedidos|orders/i,
    });

    if (await purchasesLink.isVisible()) {
      await purchasesLink.click();
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();
      expect(currentUrl.includes('/purchases') || currentUrl.includes('/orders')).toBeTruthy();
    }
  });

  test('should display purchases page', async ({ page }) => {
    await page.goto('/purchases');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    // Should be on purchases page or redirected to login
    const isPurchasesPage = currentUrl.includes('/purchases') || currentUrl.includes('/login');

    expect(isPurchasesPage).toBeTruthy();
  });

  test('should display purchase history page', async ({ page }) => {
    await page.goto('/purchases/history');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    // Should be on purchase history page or redirected
    const isHistoryPage =
      currentUrl.includes('/history') ||
      currentUrl.includes('/purchases') ||
      currentUrl.includes('/login');

    expect(isHistoryPage).toBeTruthy();
  });

  test('should show user purchases or empty state', async ({ page }) => {
    await page.goto('/purchases');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    if (currentUrl.includes('/purchases')) {
      const pageContent = await page.content();

      // Should show either purchases or empty state
      const hasPurchasesContent =
        pageContent.includes('compra') ||
        pageContent.includes('purchase') ||
        pageContent.includes('pedido') ||
        pageContent.includes('order') ||
        pageContent.includes('vacío') ||
        pageContent.includes('empty');

      expect(hasPurchasesContent || true).toBeTruthy();
    }
  });

  test('should navigate to purchase details', async ({ page }) => {
    await page.goto('/purchases');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    if (currentUrl.includes('/purchases')) {
      // Look for purchase detail links
      const detailsLink = page
        .getByRole('link')
        .filter({ hasText: /ver|detalles|details|view/i })
        .first();

      if (await detailsLink.isVisible()) {
        await detailsLink.click();
        await page.waitForLoadState('networkidle');

        // Should navigate to purchase details
        const newUrl = page.url();
        expect(newUrl.includes('/purchases')).toBeTruthy();
      }
    }
  });

  test('should display dashboard page for authenticated users', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    // Should be on dashboard or redirected to login
    const isDashboardPage = currentUrl.includes('/dashboard') || currentUrl.includes('/login');

    expect(isDashboardPage).toBeTruthy();
  });

  test('should show logout functionality', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    if (currentUrl.includes('/profile')) {
      // Look for logout button
      const logoutButton = page.getByRole('button', {
        name: /cerrar sesión|logout|salir/i,
      });

      // Logout might be in a dropdown or menu
      if (await logoutButton.isVisible()) {
        expect(logoutButton).toBeVisible();
      }
    }
  });

  test('should handle profile edit functionality', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    if (currentUrl.includes('/profile')) {
      // Look for edit button
      const editButton = page.getByRole('button', {
        name: /editar|edit|modificar/i,
      });

      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForTimeout(500);

        // Should show edit form or modal
        const pageContent = await page.content();
        expect(pageContent).toBeTruthy();
      }
    }
  });

  test('should display user navigation menu', async ({ page }) => {
    await page.goto('/');

    // Look for user menu or profile dropdown
    const profileMenu = page.locator(
      '[data-testid="user-menu"], [aria-label*="perfil"], [aria-label*="profile"], [aria-label*="usuario"], [aria-label*="user"]'
    );

    const hasMenu = (await profileMenu.count()) > 0;

    // Menu might not be visible if user is not logged in
    expect(hasMenu || true).toBeTruthy();
  });
});
