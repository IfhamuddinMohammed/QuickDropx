// pages/PaymentPage.js
import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

export default class PaymentPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async expectSummaryVisible() {
    await expect(
      this.page.getByRole('heading', { name: /summary/i })
    ).toBeVisible();
  }

  async fillStripeCard({ number, exp, cvc }) {
    await this.expectSummaryVisible();

    // Step 1: Select the Credit Card payment method
    await this.page.getByText('Credit Card').click();

    // Step 2: Click Continue — this navigates to the Stripe card entry form
    await this.page.getByRole('button', { name: 'Continue' }).click();

    // Step 3: Wait for Stripe iframe to finish loading (page shows a skeleton first)
    // frameLocator is the idiomatic Playwright API for iframe interaction.
    const frame = this.page.frameLocator('iframe[title*="Secure payment input frame"]');
    await expect(
      frame.getByRole('textbox', { name: /card number/i })
    ).toBeVisible({ timeout: 30_000 });

    // Step 4: Fill card fields inside the Stripe iframe.
    // Use pressSequentially so Stripe's input/change events fire per keystroke,
    // ensuring the form is in a fully validated state before we submit.
    await frame.getByRole('textbox', { name: /card number/i }).pressSequentially(number.replace(/\s/g, ''), { delay: 50 });
    await frame.getByRole('textbox', { name: /expiration/i }).pressSequentially(exp.replace(/\s/g, ''), { delay: 50 });
    await frame.getByRole('textbox', { name: /security code/i }).pressSequentially(cvc, { delay: 50 });

    // Step 5: Press Tab to move focus from CVC → Country (still inside the iframe).
    // This fires a proper blur/change event on the CVC field, which Stripe needs
    // to mark the form as complete. Clicking outside alone is not always enough.
    await frame.getByRole('textbox', { name: /security code/i }).press('Tab');

    // Step 6: Click outside the iframe to fully release iframe focus
    await this.page.getByRole('heading', { name: /summary/i }).click();

    // Step 7: Give Stripe's async validation a moment to settle before we submit
    await this.page.waitForTimeout(1000);
  }

  async continue() {
    const continueBtn = this.page.getByRole('button', { name: 'Continue' });
    const confirmBtn  = this.page.getByRole('button', { name: /Confirm & Pay/i });

    // Stripe may not have marked the form complete yet when Continue is first clicked.
    // Retry clicking Continue until the confirmation modal appears (up to ~30s total).
    await expect(continueBtn).toBeEnabled({ timeout: 10_000 });
    for (let attempt = 0; attempt < 5; attempt++) {
      await continueBtn.click();
      // Give the modal a few seconds to appear before retrying
      const appeared = await confirmBtn.waitFor({ state: 'visible', timeout: 6_000 })
        .then(() => true)
        .catch(() => false);
      if (appeared) break;
      // Re-check the button is still there (page didn't navigate away)
      if (!(await continueBtn.isVisible())) break;
    }

    await expect(confirmBtn).toBeVisible({ timeout: 10_000 });
    await expect(this.page.getByText(/Total Payable Now|€0\.99/i).first()).toBeVisible();

    await confirmBtn.click();
    // Payment is now processing (button disabled + spinner visible).
    // The caller is responsible for asserting the success state.
  }
}
