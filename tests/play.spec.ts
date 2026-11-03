import { test, expect } from '../fixtures';

test.describe('Play & Pre-Lobby Suite', () => {
  test.describe('Route Protection & Security', () => {
    test(
      'should redirect unauthenticated users to login page when accessing /play @security @play',
      async ({ page }) => {
        // Direct navigation to protected /play without active auth session
        await page.goto('/play');

        // Verify automatic redirection to /login
        await expect(page).toHaveURL(/\/login/);
        await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
      }
    );
  });

  test.describe('Pre-Lobby Form Validation & Interactions', () => {
    test.beforeEach(async ({ page }) => {
      // Mock authenticated session state so protected route renders the lobby input
      await page.addInitScript(() => {
        window.localStorage.setItem(
          'firebase:authUser:fake-api-key:[DEFAULT]',
          JSON.stringify({
            uid: 'test-user-id-123',
            email: 'tester@doppler.com',
            stsTokenManager: { accessToken: 'mock-token' },
          })
        );
      });
    });

    test(
      'should render pre-lobby view with Game ID input and Join button @smoke @play',
      async ({ playPage, assertNoConsoleErrors }) => {
        await playPage.goto();

        await expect(playPage.logoImage).toBeVisible();
        await expect(playPage.gameIdLabel).toBeVisible();
        await expect(playPage.joinButton).toBeVisible();
        await expect(playPage.joinButton).toBeEnabled();

        assertNoConsoleErrors();
      }
    );

    test(
      'should show validation error when submitting blank game ID @negative @validation @play',
      async ({ playPage, setsData }) => {
        await playPage.goto();

        // Submit without entering a code
        await playPage.submitJoin();

        // Assert validation error
        await expect(playPage.validationError).toBeVisible();
        await expect(playPage.validationError).toHaveText(setsData.validationErrors.gameIdRequired);
      }
    );

    test(
      'should show length validation error when game ID has fewer than 6 characters @negative @validation @play',
      async ({ playPage, setsData }) => {
        await playPage.goto();

        await playPage.enterGameId(setsData.gameLobbies.shortGameId);
        await playPage.submitJoin();

        await expect(playPage.validationError).toBeVisible();
        await expect(playPage.validationError).toHaveText(setsData.validationErrors.gameIdLength);
      }
    );

    test(
      'should show server error message when attempting to join a non-existent or inactive game @negative @play',
      async ({ playPage, setsData, page }) => {
        // Intercept Realtime Database query to simulate non-existent lobby
        await page.route('**/.firebaseio.com/lobbies/**', async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(null),
          });
        });

        await playPage.goto();
        await playPage.enterGameId(setsData.gameLobbies.nonExistentGameId);
        await playPage.submitJoin();

        // Verify friendly server error
        await expect(playPage.serverError).toBeVisible();
        await expect(playPage.serverError).toHaveText(setsData.validationErrors.gameNotFound);
      }
    );

    test(
      'should successfully initiate joining lobby when valid 6-digit game ID is entered @happy @play',
      async ({ playPage, setsData, page }) => {
        const gameId = setsData.gameLobbies.validGameId;

        // Mock active queued lobby in Firebase RTDB
        await page.route(`**/.firebaseio.com/lobbies/${gameId}**`, async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              hostId: 'host-uid-999',
              status: 'QUEUED',
              title: 'Playwright Quiz Lobby',
              players: {
                'test-user-id-123': { name: 'QA Tester', isReady: true },
              },
            }),
          });
        });

        await playPage.goto();
        await playPage.enterGameId(gameId);
        await playPage.submitJoin();

        // Should navigate to game lobby route /play/[gameId]
        await page.waitForURL((url) => url.pathname.includes(`/play/${gameId}`), {
          timeout: 10000,
        });
      }
    );
  });
});
