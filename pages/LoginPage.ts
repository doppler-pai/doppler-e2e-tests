import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserCredentials } from '../fixtures/data/authData';

/**
 * Page Object Model representation of the Doppler Sign-in / Login view (`/login`).
 */
export class LoginPage extends BasePage {
  readonly path = '/login';

  // Locators
  readonly heading: Locator;
  readonly description: Locator;
  readonly logoImage: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly emailValidationError: Locator;
  readonly passwordValidationError: Locator;
  readonly formErrorMessage: Locator;
  readonly createAccountLink: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole('heading', { name: /sign in/i });
    this.description = page.getByText(/use your email and password to access your doppler account/i);
    this.logoImage = page.getByRole('img', { name: 'Doppler' });
    this.emailInput = page.getByLabel(/^email/i);
    this.passwordInput = page.getByLabel(/^password/i);
    this.submitButton = page.getByRole('button', { name: /sign in/i });
    this.emailValidationError = page.getByText('Email is required.');
    this.passwordValidationError = page.getByText('Password is required.');
    this.formErrorMessage = page.locator('form p.text-destructive');
    this.createAccountLink = page.getByRole('link', { name: /create one/i });
  }

  /**
   * Navigates directly to the Login page.
   */
  async goto(): Promise<void> {
    await this.navigate(this.path);
    await this.waitForDomContentLoaded();
  }

  /**
   * Enters the provided email address into the email input field.
   * @param email Email address string
   */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Enters the provided password into the password input field.
   * @param password Password string
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Clicks the Sign-in submit button.
   */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Orchestrates the complete login flow with given credentials.
   * @param credentials User email and password
   */
  async login(credentials: UserCredentials): Promise<void> {
    await this.fillEmail(credentials.email);
    await this.fillPassword(credentials.password);
    await this.submit();
  }

  /**
   * Navigates to the registration view by clicking the 'Create one' link.
   */
  async clickCreateAccount(): Promise<void> {
    await this.createAccountLink.click();
  }

  /**
   * Retrieves the form-level error message text if visible.
   */
  async getFormErrorMessage(): Promise<string | null> {
    if (await this.isElementVisible(this.formErrorMessage, 3000)) {
      return this.formErrorMessage.textContent();
    }
    return null;
  }
}
