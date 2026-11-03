import { test as baseTest, expect } from './baseTest';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { authData } from './data/authData';

export interface AuthTestFixtures {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  authData: typeof authData;
}

/**
 * Extended test runner equipped with Authentication Page Objects and test datasets.
 */
export const test = baseTest.extend<AuthTestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await use(registerPage);
  },

  authData: async ({}, use) => {
    await use(authData);
  },
});

export { expect };
