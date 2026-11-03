import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file if present
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Enterprise Playwright Configuration for Doppler E2E Test Suite.
 * Configured with multi-reporter support (HTML, JUnit XML, JSON, CI GitHub Annotations),
 * failure artifact capture (traces, full-page screenshots, video recordings),
 * and cross-browser + mobile device matrix.
 *
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
  },

  /* Multi-reporter configuration for local debugging and enterprise CI/CD dashboards */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/report.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ...(process.env.CI ? [['github'] as const] : []),
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    testIdAttribute: 'data-testid',
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10 * 1000,
    navigationTimeout: 15 * 1000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
