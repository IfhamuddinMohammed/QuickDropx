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

  //Find the correct Stripe iframe FIRST (Locator API)
  const stripeIframe = this.page
    .locator('iframe[title*="Secure payment input frame"]')
    .filter({ hasText: '' }) // keeps strict mode happy
    .first();

  await expect(stripeIframe).toBeVisible({ timeout: 20_000 });

  //Enter the iframe context
  const frame = this.page.frameLocator(
    'iframe[title*="Secure payment input frame"]'
  );

  //Fill Stripe fields (ARIA-based, stable)
  await frame.getByRole('textbox', { name: /card number/i }).fill(number);
  await frame.getByRole('textbox', { name: /expiration date/i }).fill(exp);
  await frame.getByRole('textbox', { name: /security code/i }).fill(cvc);
}


  async continue() {
    const btn = this.page.getByRole('button', { name: 'Continue' });
    await expect(btn).toBeEnabled();
    await btn.click();
  }
}
