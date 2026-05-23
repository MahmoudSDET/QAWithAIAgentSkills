import { expect, Page } from '@playwright/test';
import { AuthPage, RegistrationUser } from '../pages/AuthPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { HomePage } from '../pages/HomePage';
import { PaymentPage, PaymentDetails } from '../pages/PaymentPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { ProductsPage } from '../pages/ProductsPage';
import { uniqueEmail } from './testData';

export type PurchaseScenario = {
  case: string;
  user: RegistrationUser;
  product: {
    name: string;
    quantity: number;
  };
  payment: PaymentDetails;
};

export class AutomationExerciseFlow {
  constructor(
    private readonly page: Page,
    private readonly homePage: HomePage,
    private readonly authPage: AuthPage,
    private readonly productsPage: ProductsPage,
    private readonly productDetailsPage: ProductDetailsPage,
    private readonly cartPage: CartPage,
    private readonly checkoutPage: CheckoutPage,
    private readonly paymentPage: PaymentPage,
  ) {}

  async registerNewUser(user: RegistrationUser, signupCase: string) {
    const signupName = `${user.firstName} ${user.lastName}`;
    const signupEmail = uniqueEmail(signupCase);

    await this.homePage.goto('/');
    await this.homePage.openSignupLogin();
    await this.authPage.startSignup(signupName, signupEmail);
    await this.authPage.expectAccountInformationStep();
    await this.authPage.fillAccountDetails(user);
    await this.authPage.createAccount();
    await this.authPage.expectAccountCreated();
    await this.authPage.continueAfterAccountCreation();
    await this.homePage.expectLoggedIn();
  }

  async addProductToCart(productName: string, quantity: number) {
    await this.homePage.openProducts();
    await this.productsPage.openProductDetailsByName(productName);
    await this.productDetailsPage.setQuantity(quantity);
    await this.productDetailsPage.addToCart();
    await this.productDetailsPage.viewCartFromModal();
  }

  async proceedFromCartToOrderPlacement() {
    await this.cartPage.proceedToCheckout();
    await this.checkoutPage.placeOrder();
  }

  async submitPaymentAndDownloadInvoice(payment: PaymentDetails) {
    await this.paymentPage.fillPaymentDetails(payment);
    await this.paymentPage.submitPayment();
    await this.paymentPage.expectOrderPlaced();

    const downloadPromise = this.page.waitForEvent('download');
    await this.paymentPage.clickDownloadInvoice();
    const download = await downloadPromise;

    await expect.soft(download.suggestedFilename(), 'Downloaded invoice should have a filename').toBeTruthy();
  }

  async completePurchaseAndDownloadInvoice(scenario: PurchaseScenario) {
    await this.registerNewUser(scenario.user, scenario.case);
    await this.addProductToCart(scenario.product.name, scenario.product.quantity);
    await this.proceedFromCartToOrderPlacement();
    await this.submitPaymentAndDownloadInvoice(scenario.payment);
  }

  async startSignup(name: string, email: string) {
    await this.homePage.goto('/');
    await this.homePage.openSignupLogin();
    await this.authPage.startSignup(name, email);
  }

  async expectSignupRejected() {
    await expect(this.authPage.accountInformationHeading).not.toBeVisible();
  }

  async addProductAndVerifyQuantity(productName: string, quantity: number) {
    await this.homePage.goto('/');
    await this.homePage.openProducts();
    await this.productsPage.openProductDetailsByName(productName);
    await this.productDetailsPage.setQuantity(quantity);
    await this.productDetailsPage.addToCart();
    await this.productDetailsPage.viewCartFromModal();

    const quantityInCart = await this.cartPage.getProductQuantityByName(productName);
    await expect(quantityInCart).toBe(quantity);
  }
}
