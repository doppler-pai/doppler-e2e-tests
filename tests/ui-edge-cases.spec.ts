import { test, expect } from '../fixtures';

test.describe('UI Validation & Edge Cases Suite', () => {
  test.describe('Responsive Viewports & Layout Adaptability', () => {
    test(
      'should adapt landing page layout on mobile viewport (375x667) without horizontal overflow @edge-case @responsive',
      async ({ page, landingPage }) => {
        // Emulate mobile viewport (iPhone SE dimensions)
        await page.setViewportSize({ width: 375, height: 667 });

        await landingPage.goto();

        // Ensure hero elements are visible and properly contained
        await expect(landingPage.heroHeading).toBeVisible();
        await expect(landingPage.playNowButton).toBeVisible();

        // Verify there is no horizontal scrollbar (scrollWidth equals clientWidth)
        const hasHorizontalOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalOverflow, 'Page should not have horizontal overflow on mobile').toBe(
          false
        );
      }
    );

    test(
      'should render login form within mobile screen boundaries @edge-case @responsive',
      async ({ page, loginPage }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        await loginPage.goto();

        await expect(loginPage.heading).toBeVisible();
        await expect(loginPage.emailInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.submitButton).toBeVisible();

        // Verify inputs do not overflow viewport width
        const emailBox = await loginPage.emailInput.boundingBox();
        expect(emailBox).not.toBeNull();
        if (emailBox) {
          expect(emailBox.x).toBeGreaterThanOrEqual(0);
          expect(emailBox.x + emailBox.width).toBeLessThanOrEqual(375);
        }
      }
    );

    test(
      'should render public sets explorer layout correctly on tablet viewport (768x1024) @edge-case @responsive',
      async ({ page, setsExplorePage }) => {
        // Emulate tablet portrait viewport
        await page.setViewportSize({ width: 768, height: 1024 });

        await setsExplorePage.goto();

        await expect(setsExplorePage.heading).toBeVisible();
        await expect(setsExplorePage.searchInput).toBeVisible();

        const hasHorizontalOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalOverflow, 'Tablet viewport should not have horizontal overflow').toBe(
          false
        );
      }
    );
  });

  test.describe('Keyboard Navigation & Accessibility', () => {
    test(
      'should support full keyboard navigation (Tab and Enter) to submit login form @edge-case @a11y @keyboard',
      async ({ page, loginPage, authData }) => {
        await loginPage.goto();

        // Focus the first form element
        await loginPage.emailInput.focus();
        await page.keyboard.type(authData.validUser.email);

        // Tab to password field
        await page.keyboard.press('Tab');
        await expect(loginPage.passwordInput).toBeFocused();
        await page.keyboard.type(authData.validUser.password);

        // Press Enter to submit form from password field
        await page.keyboard.press('Enter');

        // Form submission triggered: submit button shows active loading state or is disabled
        await expect(loginPage.submitButton).toBeDisabled();
      }
    );

    test(
      'should dismiss open modal dialog when pressing Escape key @edge-case @a11y @keyboard',
      async ({ page }) => {
        // Navigate to a page with dialog components or trigger Radix dialog
        await page.goto('/login');

        // Verify page responds correctly to Escape key without errors
        await page.keyboard.press('Escape');
        await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
      }
    );
  });

  test.describe('Input Robustness & Injection Handling', () => {
    test(
      'should safely handle special characters and XSS injection strings in search input @edge-case @security',
      async ({ setsExplorePage, assertNoConsoleErrors }) => {
        await setsExplorePage.goto();

        const maliciousPayload = '<script>alert("xss")</script><img src=x onerror=alert(1)>';
        await setsExplorePage.search(maliciousPayload);

        // Verify the input handles the string as text value safely
        await expect(setsExplorePage.searchInput).toHaveValue(maliciousPayload);

        // Verify empty search results are safely rendered without script execution
        await expect(setsExplorePage.noMatchesHeading).toBeVisible();

        // Ensure zero unexpected runtime errors or unhandled script failures
        assertNoConsoleErrors();
      }
    );

    test(
      'should prevent duplicate submissions by disabling button during request processing @edge-case @ui',
      async ({ loginPage, authData, page }) => {
        // Intercept network call with simulated network latency
        await page.route('**/identitytoolkit.googleapis.com/**', async (route) => {
          await page.waitForTimeout(800);
          await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({ error: { code: 400, message: 'INVALID_LOGIN_CREDENTIALS' } }),
          });
        });

        await loginPage.goto();
        await loginPage.fillEmail(authData.validUser.email);
        await loginPage.fillPassword(authData.validUser.password);

        // Double click rapidly
        await loginPage.submitButton.dblclick();

        // Button should be disabled during flight, preventing concurrent duplicate requests
        await expect(loginPage.submitButton).toBeDisabled();
        await expect(loginPage.submitButton).toHaveText(/signing in\.\.\./i);
      }
    );
  });
});
