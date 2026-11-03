import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Component Object Model representation of the Doppler Application Sidebar.
 */
export class SidebarComponent extends BasePage {
  readonly sidebarContainer: Locator;
  readonly logoImage: Locator;
  readonly playNowLink: Locator;
  readonly exploreLink: Locator;
  readonly dopplesLink: Locator;
  readonly marketLink: Locator;
  readonly setsLink: Locator;
  readonly createSetLink: Locator;
  readonly logoutButton: Locator;
  readonly userStatus: Locator;

  constructor(page: Page) {
    super(page);

    this.sidebarContainer = page.locator('[data-sidebar="sidebar"], aside');
    this.logoImage = page.getByRole('img', { name: 'Doppler' });
    this.playNowLink = page.getByRole('button', { name: /play now/i });
    this.exploreLink = page.getByRole('button', { name: /explore/i });
    this.dopplesLink = page.getByRole('button', { name: /dopples/i });
    this.marketLink = page.getByRole('button', { name: /dopple market/i });
    this.setsLink = page.getByRole('button', { name: /^sets$/i });
    this.createSetLink = page.getByRole('button', { name: /create new set/i });
    this.logoutButton = page.getByRole('button', { name: /logout/i });
    this.userStatus = page.getByText(/not signed in|signed in/i);
  }

  /**
   * Navigates to a specific section via sidebar button.
   */
  async navigateTo(section: 'play' | 'explore' | 'sets' | 'create' | 'market' | 'dopples'): Promise<void> {
    switch (section) {
      case 'play':
        await this.playNowLink.click();
        break;
      case 'explore':
        await this.exploreLink.click();
        break;
      case 'sets':
        await this.setsLink.click();
        break;
      case 'create':
        await this.createSetLink.click();
        break;
      case 'market':
        await this.marketLink.click();
        break;
      case 'dopples':
        await this.dopplesLink.click();
        break;
    }
  }

  /**
   * Clicks the Logout button in the sidebar footer.
   */
  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
