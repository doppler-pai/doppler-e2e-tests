import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { RegisterCredentials } from '../fixtures/data/authData';

/**
 * Page Object Model representation of the Doppler Sign-up / Register view (`/register`).
 */
export class RegisterPage extends BasePage {
  readonly path = '/register';

  // Locators
  readonly heading: Locator;
  readonly description: Locator;
  readonly logoImage: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly emailValidationError: Locator;
  readonly passwordValidationError: Locator;
  readonly confirmPasswordValidationError: Locator;
  readonly passwordsMismatchError: Locator;
  readonly formErrorMessage: Locator;
  readonly signInLink: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole('heading', { name: /create account/i });
    this.description = page.getByText(/sign up with your email and password to start using doppler/i);
    this.logoImage = page.getByRole('main').getByRole('img', { name: 'Doppler' });
    this.emailInput = page.getByLabel(/^email/i);
    this.passwordInput = page.getByLabel(/^password$/i);
    this.confirmPasswordInput = page.getByLabel(/confirm password/i);
    this.submitButton = page.getByRole('button', { name: /create account/i });
    this.emailValidationError = page.getByText('Email is required.');
    this.passwordValidationError = page.getByText('Password is required.');
    this.confirmPasswordValidationError = page.getByText('Please confirm your password.');
    this.passwordsMismatchError = page.getByText('Passwords do not match.');
    this.formErrorMessage = page.locator('form p.text-destructive');
    this.signInLink = page.getByRole('link', { name: /sign in/i });
  }

  /**
   * Navigates directly to the Register page.
   */
  async goto(): Promise<void> {
    await this.navigate(this.path);
    await this.waitForDomContentLoaded();
  }

  /**
   * Fills out the registration form fields.
   */
  async fillForm(data: Partial<RegisterCredentials>): Promise<void> {
    if (data.email !== undefined) await this.emailInput.fill(data.email);
    if (data.password !== undefined) await this.passwordInput.fill(data.password);
    if (data.confirmPassword !== undefined) await this.confirmPasswordInput.fill(data.confirmPassword);
  }

  /**
   * Clicks the Create Account submit button.
   */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Orchestrates the complete registration flow.
   */
  async register(data: RegisterCredentials): Promise<void> {
    await this.fillForm(data);
    await this.submit();
  }

  /**
   * Navigates to the sign in view by clicking the 'Sign in' link.
   */
  async clickSignIn(): Promise<void> {
    await this.signInLink.click();
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
