import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model representation of the Doppler Play / Pre-lobby view (`/play`).
 */
export class PlayPage extends BasePage {
  readonly path = '/play';

  // Locators
  readonly logoImage: Locator;
  readonly gameIdLabel: Locator;
  readonly gameIdInput: Locator;
  readonly joinButton: Locator;
  readonly validationError: Locator;
  readonly serverError: Locator;

  constructor(page: Page) {
    super(page);

    this.logoImage = page.getByRole('main').getByRole('img', { name: 'Doppler' });
    this.gameIdLabel = page.getByText(/game id/i);
    // Targets the InputOTP hidden or text input
    this.gameIdInput = page.locator('input[autocomplete="one-time-code"], input[data-input-otp="true"], form input').first();
    this.joinButton = page.getByRole('button', { name: /join game/i });
    this.validationError = page.locator('p.text-destructive').filter({ hasText: /game id/i });
    this.serverError = page.locator('p.text-destructive').filter({ hasText: /game not found|in progress/i });
  }

  /**
   * Navigates directly to the Play view.
   */
  async goto(): Promise<void> {
    await this.navigate(this.path);
    await this.waitForDomContentLoaded();
  }

  /**
   * Enters the 6-character game code into the OTP input.
   * @param gameId 6-character game code
   */
  async enterGameId(gameId: string): Promise<void> {
    await this.gameIdInput.focus();
    await this.gameIdInput.fill(gameId);
  }

  /**
   * Submits the pre-lobby join form.
   */
  async submitJoin(): Promise<void> {
    await this.joinButton.click();
  }

  /**
   * Complete action: fills game ID and attempts to join the lobby.
   */
  async joinGame(gameId: string): Promise<void> {
    await this.enterGameId(gameId);
    await this.submitJoin();
  }
}
