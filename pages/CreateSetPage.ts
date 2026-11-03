import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { QuizSetData } from '../fixtures/data/setsData';

/**
 * Page Object Model representation of the Create Set view (`/sets/create`).
 */
export class CreateSetPage extends BasePage {
  readonly path = '/sets/create';

  // Locators
  readonly titleInput: Locator;
  readonly descriptionTextarea: Locator;
  readonly publicModeSwitch: Locator;
  readonly publicModeLabel: Locator;
  readonly saveButton: Locator;
  readonly titleError: Locator;
  readonly descriptionError: Locator;
  readonly questionsError: Locator;

  constructor(page: Page) {
    super(page);

    this.titleInput = page.getByPlaceholder('Title');
    this.descriptionTextarea = page.getByPlaceholder('Description');
    this.publicModeSwitch = page.locator('#public-mode');
    this.publicModeLabel = page.locator('label[for="public-mode"]');
    this.saveButton = page.getByRole('button', { name: /^save$/i });
    this.titleError = page.getByText('Title is required');
    this.descriptionError = page.getByText('Description is required');
    this.questionsError = page.getByText('At least one question is required');
  }

  /**
   * Navigates directly to the Create Set page.
   */
  async goto(): Promise<void> {
    await this.navigate(this.path);
    await this.waitForDomContentLoaded();
  }

  /**
   * Fills in set details: title, description, and public/private toggle.
   */
  async fillSetDetails(data: Partial<QuizSetData>): Promise<void> {
    if (data.title !== undefined) {
      await this.titleInput.fill(data.title);
    }
    if (data.description !== undefined) {
      await this.descriptionTextarea.fill(data.description);
    }
    if (data.isPublic !== undefined) {
      const isChecked = await this.publicModeSwitch.isChecked();
      if (isChecked !== data.isPublic) {
        await this.publicModeSwitch.click();
      }
    }
  }

  /**
   * Clicks the Save button.
   */
  async clickSave(): Promise<void> {
    await this.saveButton.click();
  }
}
