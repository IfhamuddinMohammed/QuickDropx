//choices/ChoosePackagePage.js


import BasePage from './BasePage.js';
import PaymentPage from './PaymentPage.js';
import { expect } from '@playwright/test';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default class ChoosePackagePage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = () => this.page.getByText('CHOOSE A PACKAGE', { exact: false });
  }

  async expectVisible() {
    await expect(this.heading()).toBeVisible();
    await expect(this.page.getByText('STARTER 200', { exact: true })).toBeVisible();
    await expect(this.page.getByText('ECONOMY 400', { exact: true })).toBeVisible();
    await expect(this.page.getByText('PREMIUM 800', { exact: true })).toBeVisible();
  }

  /**
   * Select a package card by the visible package label (partial or exact).
   * The method clicks the package card then clicks the 'Start Now' button inside that card.
   * Returns PaymentPage instance.
   */
async choosePackage(packageLabel) {
  await this.expectVisible();

  // 1️⃣ Anchor on the package title text
  const title = this.page.getByText(
    new RegExp(`^${escapeRegExp(packageLabel)}`, 'i')
  );

  await expect(title).toBeVisible();

  // 2️⃣ Get the closest card container
  const card = title.locator('xpath=ancestor::div[contains(@class,"rounded")]').first();
  await expect(card).toBeVisible();

  // 3️⃣ Click ONLY the visible CTA inside this card
  const startNowBtn = card.getByRole('button', {
    name: /Start Now/i,
  }).first();

  await expect(startNowBtn).toBeVisible();
  await startNowBtn.click();

  await expect(
  this.page.getByRole('heading', { name: /summary/i })
).toBeVisible();

  return new PaymentPage(this.page);
}
}