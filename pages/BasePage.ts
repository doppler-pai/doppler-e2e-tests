import { Page, Locator, Response } from '@playwright/test';

/**
 * Abstract BasePage class adhering to the Page Object Model (POM) pattern.
 * Provides resilient, enterprise-grade interaction helpers, state assertions,
 * and navigation utilities for all extending page classes.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to a specific URL path relative to the baseURL or an absolute URL.
   * @param path Relative path (e.g. '/login', '/play') or absolute URL
   */
  async navigate(path: string = ''): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Returns the current page URL string.
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Retrieves the document title of the active page.
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Waits for the page URL to match the expected URL string or regular expression.
   * @param urlOrPattern Target URL string or RegExp
   * @param timeout Optional maximum wait duration in milliseconds
   */
  async waitForUrl(urlOrPattern: string | RegExp, timeout = 10000): Promise<void> {
    await this.page.waitForURL(urlOrPattern, { timeout });
  }

  /**
   * Reloads the current page and waits for DOM content to finish loading.
   */
  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  /**
   * Waits for network requests to settle (zero active requests for at least 500ms).
   * @param timeout Optional maximum wait duration in milliseconds
   */
  async waitForNetworkIdle(timeout = 10000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Waits for DOMContentLoaded load state.
   * @param timeout Optional maximum wait duration in milliseconds
   */
  async waitForDomContentLoaded(timeout = 10000): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded', { timeout });
  }

  /**
   * Intercepts and waits for an HTTP API response matching a URL pattern and optional status.
   * @param urlPattern URL substring or RegExp to match
   * @param expectedStatus Expected HTTP status code (e.g. 200, 201)
   * @param timeout Optional maximum wait duration in milliseconds
   */
  async waitForApiResponse(
    urlPattern: string | RegExp,
    expectedStatus?: number,
    timeout = 10000
  ): Promise<Response> {
    return this.page.waitForResponse(
      (resp) => {
        const matchesUrl =
          typeof urlPattern === 'string'
            ? resp.url().includes(urlPattern)
            : urlPattern.test(resp.url());
        return matchesUrl && (expectedStatus === undefined || resp.status() === expectedStatus);
      },
      { timeout }
    );
  }

  /**
   * Simulates pressing a keyboard key (e.g. 'Enter', 'Escape', 'Tab').
   * @param key Keyboard key identifier
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Checks whether a given locator is visible within the specified timeout without throwing an error.
   * @param locator Playwright Locator instance
   * @param timeout Maximum wait duration in milliseconds
   */
  async isElementVisible(locator: Locator, timeout = 5000): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Waits for a locator to disappear or be detached from the DOM.
   * @param locator Playwright Locator instance
   * @param timeout Maximum wait duration in milliseconds
   */
  async waitForElementHidden(locator: Locator, timeout = 5000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Scrolls an element smoothly into view if it is not already visible.
   * @param locator Playwright Locator instance
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Captures a full-page screenshot and saves it under test-results/screenshots.
   * @param name Descriptive name identifier for the screenshot
   */
  async captureScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }
}
