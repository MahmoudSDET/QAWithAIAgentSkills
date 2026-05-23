import { expect, Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path = '/') {
    await this.page.goto(path);
  }

  async expectUrlContains(fragment: string) {
    await expect(this.page).toHaveURL(new RegExp(fragment));
  }
}
