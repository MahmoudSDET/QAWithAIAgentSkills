import { test, expect } from '../fixtures/test-fixtures';
import { loadJson } from '../utils/dataLoader';
import type { PurchaseData } from '../types/ecommerce-purchase.types';

const data = loadJson<PurchaseData>('ecommerce-purchase.data.json');

test.describe('Automation Exercise - Ecommerce Purchase', () => {
  for (const purchaseCase of data.purchaseCases) {
    test(`purchase flow - ${purchaseCase.case}`, async ({
      automationExerciseFlow,
    }) => {
      await test.step('Register new user', async () => {
        await automationExerciseFlow.registerNewUser(purchaseCase.user, purchaseCase.case);
      });

      await test.step('Add product and complete checkout', async () => {
        await automationExerciseFlow.addProductToCart(
          purchaseCase.product.name,
          purchaseCase.product.quantity,
        );
        await automationExerciseFlow.proceedFromCartToOrderPlacement();
      });

      await test.step('Pay and download invoice', async () => {
        await automationExerciseFlow.submitPaymentAndDownloadInvoice(purchaseCase.payment);
      });
    });
  }

  for (const negativeCase of data.negativeCases) {
    test(`negative signup - ${negativeCase.case}`, async ({ automationExerciseFlow }) => {
      await automationExerciseFlow.startSignup(negativeCase.name, negativeCase.email);
      await automationExerciseFlow.expectSignupRejected();
    });
  }

  for (const boundaryCase of data.boundaryCases) {
    test(`boundary quantity - ${boundaryCase.case}`, async ({
      automationExerciseFlow,
    }) => {
      const productName = data.purchaseCases[0].product.name;

      await automationExerciseFlow.addProductAndVerifyQuantity(productName, boundaryCase.quantity);
    });
  }
});
