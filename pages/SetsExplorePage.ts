import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model representation of the Public Sets Explore view (`/sets/explore`).
 */
export class SetsExplorePage extends BasePage {
  readonly path = '/sets/explore';

  // Locators
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly setCards: Locator;
  readonly cardTitles: Locator;
  readonly noSetsFoundHeading: Locator;
  readonly noMatchesHeading: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole('heading', { level: 1, name: /public sets/i });
    this.searchInput = page.getByPlaceholder(/search public sets/i);
    this.setCards = page.locator('#SetCard');
    this.cardTitles = page.locator('#SetCard h2');
    this.noSetsFoundHeading = page.getByRole('heading', { level: 2, name: /no public sets found/i });
    this.noMatchesHeading = page.getByRole('heading', { level: 2, name: /no sets matching/i });
    this.loadingSpinner = page.locator('svg.animate-spin');
  }

  /**
   * Navigates directly to the Explore page.
   */
  async goto(): Promise<void> {
    await this.navigate(this.path);
    await this.waitForDomContentLoaded();
  }

  /**
   * Searches public sets by entering a query into the search input.
   * @param query Search query string
   */
  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  /**
   * Clears the active search query.
   */
  async clearSearch(): Promise<void> {
    await this.searchInput.fill('');
  }

  /**
   * Returns the count of currently visible quiz set cards.
   */
  async getVisibleCardsCount(): Promise<number> {
    return this.setCards.count();
  }
}
