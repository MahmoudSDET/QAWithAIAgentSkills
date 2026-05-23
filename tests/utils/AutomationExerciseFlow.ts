import { expect, Page, test } from '@playwright/test';
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

  private async step<T>(name: string, action: () => Promise<T>): Promise<T> {
    return test.step(name, action);
  }

  async registerNewUser(user: RegistrationUser, signupCase: string) {
    const signupName = `${user.firstName} ${user.lastName}`;
    const signupEmail = uniqueEmail(signupCase);

    await this.step('Open home page and validate entry point', async () => {
      await this.homePage.goto('/');
      await expect(this.homePage.signupLoginLink).toBeVisible();
    });

    await this.step('Open signup or login page and validate form', async () => {
      await this.homePage.openSignupLogin();
      await expect(this.authPage.signupNameInput).toBeVisible();
      await expect(this.authPage.signupEmailInput).toBeVisible();
    });

    await this.step('Submit signup identity details', async () => {
      await this.authPage.startSignup(signupName, signupEmail);
    });

    await this.step('Validate account information step', async () => {
      await this.authPage.expectAccountInformationStep();
    });

    await this.step('Fill account profile details', async () => {
      await this.authPage.fillAccountDetails(user);
      await expect(this.authPage.passwordInput).toHaveValue(user.password);
      await expect(this.authPage.firstNameInput).toHaveValue(user.firstName);
      await expect(this.authPage.mobileNumberInput).toHaveValue(user.mobileNumber);
    });

    await this.step('Create account from completed profile', async () => {
      await this.authPage.createAccount();
    });

    await this.step('Validate account creation confirmation', async () => {
      await this.authPage.expectAccountCreated();
    });

    await this.step('Continue after account creation', async () => {
      await this.authPage.continueAfterAccountCreation();
    });

    await this.step('Validate user is logged in', async () => {
      await this.homePage.expectLoggedIn();
    });
  }

  async addProductToCart(productName: string, quantity: number) {
    await this.step('Open products catalog and validate listing', async () => {
      await this.homePage.openProducts();
      await expect(this.productsPage.productCards.first()).toBeVisible();
    });

    await this.step(`Open details for product ${productName}`, async () => {
      await this.productsPage.openProductDetailsByName(productName);
      await expect(this.productDetailsPage.quantityInput).toBeVisible();
    });

    await this.step(`Set product quantity to ${quantity} and validate input`, async () => {
      await this.productDetailsPage.setQuantity(quantity);
      await expect(this.productDetailsPage.quantityInput).toHaveValue(String(quantity));
    });

    await this.step('Add product to cart and validate cart modal', async () => {
      await this.productDetailsPage.addToCart();
      await expect(this.productDetailsPage.viewCartLink).toBeVisible();
    });

    await this.step('Open cart from modal and validate checkout access', async () => {
      await this.productDetailsPage.viewCartFromModal();
      await expect(this.cartPage.proceedToCheckoutButton).toBeVisible();
    });
  }

  async proceedFromCartToOrderPlacement() {
    await this.step('Proceed from cart to checkout and validate order page', async () => {
      await this.cartPage.proceedToCheckout();
      await expect(this.checkoutPage.placeOrderButton).toBeVisible();
    });

    await this.step('Place order and validate payment page', async () => {
      await this.checkoutPage.placeOrder();
      await expect(this.paymentPage.nameOnCardInput).toBeVisible();
      await expect(this.paymentPage.payAndConfirmButton).toBeVisible();
    });
  }

  async submitPaymentAndDownloadInvoice(payment: PaymentDetails) {
    await this.step('Fill payment details and validate entered data', async () => {
      await this.paymentPage.fillPaymentDetails(payment);
      await expect(this.paymentPage.nameOnCardInput).toHaveValue(payment.nameOnCard);
      await expect(this.paymentPage.cardNumberInput).toHaveValue(payment.cardNumber);
      await expect(this.paymentPage.cvcInput).toHaveValue(payment.cvc);
    });

    await this.step('Submit payment', async () => {
      await this.paymentPage.submitPayment();
    });

    await this.step('Validate order placed confirmation', async () => {
      await this.paymentPage.expectOrderPlaced();
    });

    await this.step('Download invoice and validate filename', async () => {
      const downloadPromise = this.page.waitForEvent('download');
      await this.paymentPage.clickDownloadInvoice();
      const download = await downloadPromise;

      await expect.soft(
        download.suggestedFilename(),
        'Downloaded invoice should have a filename',
      ).toBeTruthy();
    });
  }

  async completePurchaseAndDownloadInvoice(scenario: PurchaseScenario) {
    await this.registerNewUser(scenario.user, scenario.case);
    await this.addProductToCart(scenario.product.name, scenario.product.quantity);
    await this.proceedFromCartToOrderPlacement();
    await this.submitPaymentAndDownloadInvoice(scenario.payment);
  }

  async startSignup(name: string, email: string) {
    await this.step('Open home page before negative signup', async () => {
      await this.homePage.goto('/');
      await expect(this.homePage.signupLoginLink).toBeVisible();
    });

    await this.step('Open signup page before negative signup', async () => {
      await this.homePage.openSignupLogin();
      await expect(this.authPage.signupEmailInput).toBeVisible();
    });

    await this.step('Submit negative signup data', async () => {
      await this.authPage.startSignup(name, email);
    });
  }

  async expectSignupRejected() {
    await this.step('Validate signup is rejected', async () => {
      await expect(this.authPage.accountInformationHeading).not.toBeVisible();
    });
  }

  async addProductAndVerifyQuantity(productName: string, quantity: number) {
    await this.step('Open home page for quantity validation flow', async () => {
      await this.homePage.goto('/');
      await expect(this.homePage.productsLink).toBeVisible();
    });

    await this.step('Open products page for quantity validation', async () => {
      await this.homePage.openProducts();
      await expect(this.productsPage.productCards.first()).toBeVisible();
    });

    await this.step(`Open ${productName} details for quantity validation`, async () => {
      await this.productsPage.openProductDetailsByName(productName);
      await expect(this.productDetailsPage.quantityInput).toBeVisible();
    });

    await this.step(`Set boundary quantity to ${quantity}`, async () => {
      await this.productDetailsPage.setQuantity(quantity);
      await expect(this.productDetailsPage.quantityInput).toHaveValue(String(quantity));
    });

    await this.step('Add boundary quantity product to cart', async () => {
      await this.productDetailsPage.addToCart();
      await expect(this.productDetailsPage.viewCartLink).toBeVisible();
    });

    await this.step('Open cart for quantity verification', async () => {
      await this.productDetailsPage.viewCartFromModal();
      await expect(this.cartPage.proceedToCheckoutButton).toBeVisible();
    });

    await this.step('Validate quantity in cart', async () => {
      const quantityInCart = await this.cartPage.getProductQuantityByName(productName);
      await expect(quantityInCart).toBe(quantity);
    });
  }
}
