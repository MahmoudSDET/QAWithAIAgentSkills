import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    super(page);
    // Accessibility tree is inconsistent for this control on Automation Exercise.
    this.proceedToCheckoutButton = page.locator('a.check_out').first();
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }

  async getProductQuantityByName(productName: string): Promise<number> {
    const row = this.page
      .locator('#cart_info_table tbody tr')
      .filter({ has: this.page.locator('a', { hasText: productName }) })
      .first();

    const quantityText = await row.locator('.cart_quantity button').innerText();
    return Number(quantityText.trim());
  }
}
