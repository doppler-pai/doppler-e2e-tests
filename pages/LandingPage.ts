import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model representation of the Doppler Landing / Home view (`/`).
 */
export class LandingPage extends BasePage {
  readonly path = '/';

  // Locators
  readonly heroHeading: Locator;
  readonly subtitle: Locator;
  readonly playNowButton: Locator;
  readonly signInButton: Locator;
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    super(page);

    this.heroHeading = page.getByRole('heading', { level: 1, name: 'Doppler' });
    this.subtitle = page.getByText(
      /test your knowledge, compete with friends, and master your subjects in a whole new way/i
    );
    this.playNowButton = page.getByRole('button', { name: /play now/i });
    this.signInButton = page.getByRole('button', { name: /sign in/i });
    this.createAccountButton = page.getByRole('button', { name: /create account/i });
  }

  /**
   * Navigates directly to the Landing page.
   */
  async goto(): Promise<void> {
    await this.navigate(this.path);
    await this.waitForDomContentLoaded();
  }

  /**
   * Clicks the primary 'Play Now' CTA button.
   */
  async clickPlayNow(): Promise<void> {
    await this.playNowButton.click();
  }

  /**
   * Clicks the 'Sign In' button leading to the authentication view.
   */
  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }

  /**
   * Clicks the 'Create Account' button leading to the registration view.
   */
  async clickCreateAccount(): Promise<void> {
    await this.createAccountButton.click();
  }
}
