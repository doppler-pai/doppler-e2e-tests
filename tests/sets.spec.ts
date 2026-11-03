import { test, expect } from '../fixtures';

test.describe('Quiz Sets & Exploration Suite', () => {
  test.describe('Public Sets Exploration', () => {
    test(
      'should render public sets explorer view with search input and zero console errors @smoke @sets',
      async ({ setsExplorePage, assertNoConsoleErrors }) => {
        await setsExplorePage.goto();

        // Verify key structural elements
        await expect(setsExplorePage.heading).toBeVisible();
        await expect(setsExplorePage.heading).toHaveText(/public sets/i);
        await expect(setsExplorePage.searchInput).toBeVisible();
        await expect(setsExplorePage.searchInput).toBeEnabled();

        // Assert clean console logs
        assertNoConsoleErrors();
      }
    );

    test(
      'should allow user to enter search query and update input value @happy @sets',
      async ({ setsExplorePage, setsData }) => {
        await setsExplorePage.goto();

        // Fill search query
        await setsExplorePage.search(setsData.searchQueries.matchingQuery);
        await expect(setsExplorePage.searchInput).toHaveValue(setsData.searchQueries.matchingQuery);

        // Clear query
        await setsExplorePage.clearSearch();
        await expect(setsExplorePage.searchInput).toHaveValue('');
      }
    );

    test(
      'should display empty search state when query matches no sets @negative @sets',
      async ({ setsExplorePage, setsData }) => {
        await setsExplorePage.goto();

        const query = setsData.searchQueries.nonExistentQuery;
        await setsExplorePage.search(query);

        // Verify empty search result notification
        await expect(setsExplorePage.noMatchesHeading).toBeVisible();
        await expect(setsExplorePage.noMatchesHeading).toContainText(query);
      }
    );
  });

  test.describe('Create Quiz Set Flow', () => {
    test(
      'should redirect unauthenticated users to login when accessing /sets/create @security @sets',
      async ({ page }) => {
        await page.goto('/sets/create');

        // Verify redirection
        await expect(page).toHaveURL(/\/login/);
        await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
      }
    );

    test.describe('Authenticated Form Operations', () => {
      test.beforeEach(async ({ page }) => {
        // Mock authenticated user session
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
        'should show validation errors when saving an empty set @negative @validation @sets',
        async ({ createSetPage, setsData }) => {
          await createSetPage.goto();

          // Attempt to save blank set
          await createSetPage.clickSave();

          // Verify field validation errors
          await expect(createSetPage.titleError).toBeVisible();
          await expect(createSetPage.titleError).toHaveText(setsData.validationErrors.titleRequired);

          await expect(createSetPage.descriptionError).toBeVisible();
          await expect(createSetPage.descriptionError).toHaveText(
            setsData.validationErrors.descriptionRequired
          );
        }
      );

      test(
        'should toggle public/private switch and update label text dynamically @happy @sets',
        async ({ createSetPage }) => {
          await createSetPage.goto();

          // Default state is private
          await expect(createSetPage.publicModeLabel).toHaveText(/private/i);

          // Click switch to enable public mode
          await createSetPage.publicModeSwitch.click();
          await expect(createSetPage.publicModeLabel).toHaveText(/public/i);

          // Toggle back to private
          await createSetPage.publicModeSwitch.click();
          await expect(createSetPage.publicModeLabel).toHaveText(/private/i);
        }
      );

      test(
        'should fill quiz set details and clear validation errors upon valid input @happy @sets',
        async ({ createSetPage, setsData }) => {
          await createSetPage.goto();

          // Trigger validation
          await createSetPage.clickSave();
          await expect(createSetPage.titleError).toBeVisible();

          // Fill valid title and description
          await createSetPage.fillSetDetails(setsData.sampleSet);

          // Assert inputs contain the populated data
          await expect(createSetPage.titleInput).toHaveValue(setsData.sampleSet.title);
          await expect(createSetPage.descriptionTextarea).toHaveValue(setsData.sampleSet.description);

          // Re-trigger save
          await createSetPage.clickSave();
          // Title & description errors should disappear
          await expect(createSetPage.titleError).not.toBeVisible();
          await expect(createSetPage.descriptionError).not.toBeVisible();
        }
      );
    });
  });
});
