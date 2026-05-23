import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type PaymentDetails = {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
};

export class PaymentPage extends BasePage {
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payAndConfirmButton: Locator;
  readonly orderPlacedHeading: Locator;
  readonly downloadInvoiceLink: Locator;

  constructor(page: Page) {
    super(page);
    this.nameOnCardInput = page.locator('input[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('input[data-qa="card-number"]');
    this.cvcInput = page.locator('input[data-qa="cvc"]');
    this.expiryMonthInput = page.locator('input[data-qa="expiry-month"]');
    this.expiryYearInput = page.locator('input[data-qa="expiry-year"]');
    this.payAndConfirmButton = page.locator('button[data-qa="pay-button"]');
    this.orderPlacedHeading = page.getByRole('heading', { name: /order placed!/i });
    this.downloadInvoiceLink = page.getByRole('link', { name: /download invoice/i });
  }

  async fillPaymentDetails(payment: PaymentDetails) {
    await this.nameOnCardInput.fill(payment.nameOnCard);
    await this.cardNumberInput.fill(payment.cardNumber);
    await this.cvcInput.fill(payment.cvc);
    await this.expiryMonthInput.fill(payment.expiryMonth);
    await this.expiryYearInput.fill(payment.expiryYear);
  }

  async submitPayment() {
    await this.payAndConfirmButton.click();
  }

  async expectOrderPlaced() {
    await expect(this.orderPlacedHeading).toBeVisible();
  }

  async clickDownloadInvoice() {
    await this.downloadInvoiceLink.click();
  }
}
