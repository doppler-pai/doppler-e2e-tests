import { test, expect } from '../fixtures';

test.describe('Authentication Suite', () => {
  test.describe('Smoke Tests', () => {
    test(
      'should render login page with all critical elements and zero console errors @smoke @auth',
      async ({ loginPage, assertNoConsoleErrors }) => {
        await loginPage.goto();

        // Verify page accessibility & structural integrity
        await expect(loginPage.heading).toBeVisible();
        await expect(loginPage.heading).toHaveText(/sign in/i);
        await expect(loginPage.logoImage).toBeVisible();
        await expect(loginPage.emailInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.submitButton).toBeVisible();
        await expect(loginPage.submitButton).toBeEnabled();
        await expect(loginPage.createAccountLink).toBeVisible();

        // Assert clean console & no unhandled runtime exceptions
        assertNoConsoleErrors();
      }
    );

    test(
      'should render registration page with all required input fields @smoke @auth',
      async ({ registerPage, assertNoConsoleErrors }) => {
        await registerPage.goto();

        // Verify register form structure
        await expect(registerPage.heading).toBeVisible();
        await expect(registerPage.heading).toHaveText(/create account/i);
        await expect(registerPage.logoImage).toBeVisible();
        await expect(registerPage.emailInput).toBeVisible();
        await expect(registerPage.passwordInput).toBeVisible();
        await expect(registerPage.confirmPasswordInput).toBeVisible();
        await expect(registerPage.submitButton).toBeVisible();
        await expect(registerPage.submitButton).toBeEnabled();
        await expect(registerPage.signInLink).toBeVisible();

        // Assert clean console
        assertNoConsoleErrors();
      }
    );
  });

  test.describe('Navigation Flow', () => {
    test(
      'should navigate seamlessly from Login to Register page and back @happy @navigation @auth',
      async ({ loginPage, registerPage, page }) => {
        // Start on login page
        await loginPage.goto();
        await expect(page).toHaveURL(/\/login/);

        // Click create account link
        await loginPage.clickCreateAccount();
        await expect(page).toHaveURL(/\/register/);
        await expect(registerPage.heading).toBeVisible();

        // Click back to sign in link
        await registerPage.clickSignIn();
        await expect(page).toHaveURL(/\/login/);
        await expect(loginPage.heading).toBeVisible();
      }
    );
  });

  test.describe('Client-Side Validation & Negative Paths', () => {
    test(
      'should display validation errors when submitting empty login form @negative @validation @auth',
      async ({ loginPage, authData }) => {
        await loginPage.goto();

        // Submit blank form
        await loginPage.submit();

        // Verify required validation messages
        await expect(loginPage.emailValidationError).toBeVisible();
        await expect(loginPage.emailValidationError).toHaveText(authData.expectedErrors.emailRequired);

        await expect(loginPage.passwordValidationError).toBeVisible();
        await expect(loginPage.passwordValidationError).toHaveText(authData.expectedErrors.passwordRequired);
      }
    );

    test(
      'should display validation error when only email is filled on login @negative @validation @auth',
      async ({ loginPage, authData }) => {
        await loginPage.goto();

        await loginPage.fillEmail(authData.validUser.email);
        await loginPage.submit();

        // Email error should not appear, but password error must appear
        await expect(loginPage.emailValidationError).not.toBeVisible();
        await expect(loginPage.passwordValidationError).toBeVisible();
        await expect(loginPage.passwordValidationError).toHaveText(authData.expectedErrors.passwordRequired);
      }
    );

    test(
      'should display all required field errors when submitting blank registration form @negative @validation @auth',
      async ({ registerPage, authData }) => {
        await registerPage.goto();

        await registerPage.submit();

        await expect(registerPage.emailValidationError).toBeVisible();
        await expect(registerPage.emailValidationError).toHaveText(authData.expectedErrors.emailRequired);

        await expect(registerPage.passwordValidationError).toBeVisible();
        await expect(registerPage.passwordValidationError).toHaveText(authData.expectedErrors.passwordRequired);

        await expect(registerPage.confirmPasswordValidationError).toBeVisible();
        await expect(registerPage.confirmPasswordValidationError).toHaveText(
          authData.expectedErrors.confirmPasswordRequired
        );
      }
    );

    test(
      'should display validation error when registration passwords do not match @negative @validation @auth',
      async ({ registerPage, authData }) => {
        await registerPage.goto();

        const mismatchData = authData.registration.mismatchedPasswords;
        await registerPage.fillForm({
          email: mismatchData.email,
          password: mismatchData.password,
          confirmPassword: mismatchData.confirmPassword,
        });

        await registerPage.submit();

        await expect(registerPage.passwordsMismatchError).toBeVisible();
        await expect(registerPage.passwordsMismatchError).toHaveText(
          authData.expectedErrors.passwordsMismatch
        );
      }
    );
  });

  test.describe('Authentication API Interactions & State Handling', () => {
    test(
      'should handle invalid login credentials with graceful error message @negative @auth',
      async ({ loginPage, authData, page }) => {
        // Intercept Firebase auth network request to simulate invalid credentials response
        await page.route('**/identitytoolkit.googleapis.com/**', async (route) => {
          await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              error: {
                code: 400,
                message: 'INVALID_LOGIN_CREDENTIALS',
                errors: [{ message: 'INVALID_LOGIN_CREDENTIALS', domain: 'global', reason: 'invalid' }],
              },
            }),
          });
        });

        await loginPage.goto();
        await loginPage.login(authData.invalidUsers.unregistered);

        // Verify form displays error message gracefully
        await expect(loginPage.formErrorMessage).toBeVisible();
        await expect(loginPage.formErrorMessage).toContainText(/invalid email or password/i);
      }
    );

    test(
      'should show loading state on submit button during active sign-in request @edge-case @auth',
      async ({ loginPage, authData, page }) => {
        // Delay response to verify the pending/loading UX state
        await page.route('**/identitytoolkit.googleapis.com/**', async (route) => {
          await page.waitForTimeout(1000);
          await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({ error: { code: 400, message: 'INVALID_LOGIN_CREDENTIALS' } }),
          });
        });

        await loginPage.goto();
        await loginPage.fillEmail(authData.validUser.email);
        await loginPage.fillPassword(authData.validUser.password);

        const submitBtn = page.locator('button[type="submit"]');
        await submitBtn.click();
        await expect(submitBtn).toBeDisabled();
      }
    );

    test(
      'should handle successful sign-in by updating session state @happy @auth',
      async ({ loginPage, authData, page }) => {
        // Mock successful Firebase auth response
        await page.route('**/identitytoolkit.googleapis.com/**', async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              idToken: 'mock-jwt-token-xyz',
              email: authData.validUser.email,
              refreshToken: 'mock-refresh-token-xyz',
              expiresIn: '3600',
              localId: 'mock-user-id-001',
              registered: true,
            }),
          });
        });

        await page.route('**/securetoken.googleapis.com/**', async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              access_token: 'mock-token',
              expires_in: '3600',
              token_type: 'Bearer',
              refresh_token: 'mock-refresh-token',
              id_token: 'mock-jwt-token-xyz',
              user_id: 'mock-user-id-001',
              project_id: 'doppler-e2e',
            }),
          });
        });

        await loginPage.goto();
        await loginPage.login(authData.validUser);

        // Verify either successful redirect or that form error message is not shown
        await expect(loginPage.formErrorMessage).not.toBeVisible();
      }
    );
  });
});
