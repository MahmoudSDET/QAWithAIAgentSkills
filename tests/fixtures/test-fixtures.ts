import { test as base } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { HomePage } from '../pages/HomePage';
import { PaymentPage } from '../pages/PaymentPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { ProductsPage } from '../pages/ProductsPage';
import { AutomationExerciseFlow } from '../utils/AutomationExerciseFlow';

type Pages = {
  homePage: HomePage;
  authPage: AuthPage;
  productsPage: ProductsPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
  automationExerciseFlow: AutomationExerciseFlow;
};

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },
  automationExerciseFlow: async (
    { page, homePage, authPage, productsPage, productDetailsPage, cartPage, checkoutPage, paymentPage },
    use,
  ) => {
    await use(
      new AutomationExerciseFlow(
        page,
        homePage,
        authPage,
        productsPage,
        productDetailsPage,
        cartPage,
        checkoutPage,
        paymentPage,
      ),
    );
  },
});

export { expect } from '@playwright/test';
