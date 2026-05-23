import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly signupLoginLink: Locator;
  readonly productsLink: Locator;
  readonly loggedInAsText: Locator;

  constructor(page: Page) {
    super(page);
    this.signupLoginLink = page.getByRole('link', { name: /signup \/ login/i });
    this.productsLink = page.getByRole('link', { name: /products/i });
    this.loggedInAsText = page.locator('a:has-text("Logged in as")');
  }

  async openSignupLogin() {
    await this.signupLoginLink.click();
  }

  async openProducts() {
    await this.productsLink.click();
  }

  async expectLoggedIn() {
    await expect(this.loggedInAsText).toBeVisible();
  }
}
