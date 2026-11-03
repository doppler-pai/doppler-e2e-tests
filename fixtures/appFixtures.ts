import { test as authTest, expect } from './authFixtures';
import { LandingPage } from '../pages/LandingPage';
import { SidebarComponent } from '../pages/SidebarComponent';
import { PlayPage } from '../pages/PlayPage';
import { SetsExplorePage } from '../pages/SetsExplorePage';
import { CreateSetPage } from '../pages/CreateSetPage';
import { setsData } from './data/setsData';

export interface AppTestFixtures {
  landingPage: LandingPage;
  sidebar: SidebarComponent;
  playPage: PlayPage;
  setsExplorePage: SetsExplorePage;
  createSetPage: CreateSetPage;
  setsData: typeof setsData;
}

/**
 * Extended test runner bundling all application Page Objects, components, and datasets.
 */
export const test = authTest.extend<AppTestFixtures>({
  landingPage: async ({ page }, use) => {
    const landingPage = new LandingPage(page);
    await use(landingPage);
  },

  sidebar: async ({ page }, use) => {
    const sidebar = new SidebarComponent(page);
    await use(sidebar);
  },

  playPage: async ({ page }, use) => {
    const playPage = new PlayPage(page);
    await use(playPage);
  },

  setsExplorePage: async ({ page }, use) => {
    const setsExplorePage = new SetsExplorePage(page);
    await use(setsExplorePage);
  },

  createSetPage: async ({ page }, use) => {
    const createSetPage = new CreateSetPage(page);
    await use(createSetPage);
  },

  setsData: async ({}, use) => {
    await use(setsData);
  },
});

export { expect };
