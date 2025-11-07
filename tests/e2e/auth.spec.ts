import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: /bienvenido de nuevo/i })).toBeVisible();
  });

  test('should display register page', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveURL('/register');
    await expect(page.getByRole('heading', { name: /crea tu cuenta/i })).toBeVisible();
  });

  test('should show validation errors on empty login form submission', async ({ page }) => {
    await page.goto('/login');

    // Try to submit empty form
    const submitButton = page.getByRole('button', {
      name: /iniciar sesión/i,
    });
    await submitButton.click();

    // Wait for validation errors to appear
    await page.waitForTimeout(500);

    // Should show validation errors for email or password
    const emailError = page.locator('#email-error');
    const passwordError = page.locator('#password-error');

    // At least one error should be visible
    const emailVisible = await emailError.isVisible().catch(() => false);
    const passwordVisible = await passwordError.isVisible().catch(() => false);

    expect(emailVisible || passwordVisible).toBeTruthy();
  });

  test('should show validation errors on empty register form submission', async ({ page }) => {
    await page.goto('/register');

    // Wait for form to load
    await page.waitForLoadState('networkidle');

    // Try to submit empty form
    const submitButton = page.getByRole('button', {
      name: /crear cuenta/i,
    });
    await submitButton.click();

    // Wait for validation errors to appear
    await page.waitForTimeout(500);

    // Should show validation errors - check for first name error specifically
    const firstNameError = page.locator('#firstName-error');
    await expect(firstNameError).toBeVisible();
  });

  test('should navigate from login to register page', async ({ page }) => {
    await page.goto('/login');

    // Click on register button (it's a button, not a link)
    const registerButton = page.getByRole('button', {
      name: /regístrate aquí/i,
    });
    await registerButton.click();

    await expect(page).toHaveURL('/register');
  });

  test('should navigate from register to login page', async ({ page }) => {
    await page.goto('/register');

    // Wait for page to load completely
    await page.waitForLoadState('networkidle');

    // Click on login button (it's a button, not a link)
    const loginButton = page.getByRole('button', {
      name: /^iniciar sesión$/i,
    });
    await loginButton.click();

    await expect(page).toHaveURL('/login');
  });

  test('should display password field as password type', async ({ page }) => {
    await page.goto('/login');

    const passwordInput = page.getByLabel(/contraseña|password/i);
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should accept email input in login form', async ({ page }) => {
    await page.goto('/login');

    const emailInput = page.locator('#email');
    await emailInput.click();
    await emailInput.fill('test@example.com');

    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('should fill register form without errors', async ({ page }) => {
    await page.goto('/register');

    // Generate random email to avoid conflicts
    const timestamp = Date.now();
    const randomEmail = `test${timestamp}@example.com`;

    // Fill form fields
    const nameInput = page.getByLabel(/nombre|name/i).first();
    const emailInput = page.getByLabel(/correo|email/i);
    const passwordInput = page.getByLabel(/contraseña|password/i).first();

    await nameInput.fill('Test User');
    await emailInput.fill(randomEmail);
    await passwordInput.fill('TestPassword123!');

    // Verify fields are filled
    await expect(nameInput).toHaveValue('Test User');
    await expect(emailInput).toHaveValue(randomEmail);
    await expect(passwordInput).toHaveValue('TestPassword123!');
  });
});
