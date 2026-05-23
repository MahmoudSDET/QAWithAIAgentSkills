import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [
    ['list'],
    ['allure-playwright', { detail: true, suiteTitle: false, outputFolder: 'allure-results' }],
  ],
  use: {
    baseURL: 'https://www.automationexercise.com',
    trace: 'on-first-retry',
  },
});
