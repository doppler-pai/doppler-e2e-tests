import { test as base, expect, Page } from '@playwright/test';

/**
 * Fixture types provided to all Playwright tests.
 */
export interface BaseTestFixtures {
  /**
   * Tracks and stores browser console.error messages captured during the test.
   */
  consoleErrors: string[];

  /**
   * Tracks and stores unhandled JavaScript exceptions thrown on the page.
   */
  pageErrors: Error[];

  /**
   * Helper utility to assert that no uncaught errors or console.error logs were emitted.
   */
  assertNoConsoleErrors: () => void;
}

/**
 * Extended Playwright test instance equipped with automatic error listeners
 * and observability utilities.
 */
export const test = base.extend<BaseTestFixtures>({
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];

    const consoleListener = (msg: { type: () => string; text: () => string }) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    };

    page.on('console', consoleListener);
    await use(errors);
    page.off('console', consoleListener);
  },

  pageErrors: async ({ page }, use) => {
    const unhandledErrors: Error[] = [];

    const errorListener = (error: Error) => {
      unhandledErrors.push(error);
    };

    page.on('pageerror', errorListener);
    await use(unhandledErrors);
    page.off('pageerror', errorListener);
  },

  assertNoConsoleErrors: async ({ consoleErrors, pageErrors }, use) => {
    await use(() => {
      expect(
        pageErrors,
        `Expected 0 unhandled page errors, but encountered:\n${pageErrors.map((e) => e.message).join('\n')}`
      ).toHaveLength(0);

      // Filter out known harmless third-party logs if necessary
      const criticalErrors = consoleErrors.filter(
        (err) => !err.includes('favicon.ico') && !err.includes('Download the React DevTools')
      );

      expect(
        criticalErrors,
        `Expected 0 console.error logs, but encountered:\n${criticalErrors.join('\n')}`
      ).toHaveLength(0);
    });
  },
});

export { expect };
