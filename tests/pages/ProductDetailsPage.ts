import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailsPage extends BasePage {
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly viewCartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.quantityInput = page.locator('#quantity');
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.viewCartLink = page.getByRole('link', { name: /view cart/i });
  }

  async setQuantity(quantity: number) {
    await this.quantityInput.fill(String(quantity));
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async viewCartFromModal() {
    await this.viewCartLink.click();
  }
}
