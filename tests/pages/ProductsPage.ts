import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly productCards: Locator;

  constructor(page: Page) {
    super(page);
    this.productCards = page.locator('.features_items .product-image-wrapper');
  }

  async openProductDetailsByName(productName: string) {
    const card = this.productCards.filter({
      has: this.page.locator('.productinfo p', { hasText: productName }),
    }).first();

    await card.locator('a:has-text("View Product")').click();
  }
}
