// pages/ChooseStorePage.js
import BasePage from './BasePage.js';
import { expect } from '@playwright/test';
import ChoosePackagePage from './ChoosePackagePage.js';

export default class ChooseStorePage extends BasePage {
  constructor(page) {
    super(page);

    this.heading = page.getByRole('heading', {
      name: /CHOOSE A PLATFORM TO SELL ON/i
    });
    this.continueButton = page.getByRole('button', { name: /continue/i });
  }

  async expectVisible() {
    await expect(this.heading).toBeVisible();
  }

  /**
   * Select platform (e.g. eBay / Shopify) and continue
   * @param {string} platformName
   */
  async chooseStore(platformName) {
    await this.expectVisible();

    const platformCard = this.page.getByText(platformName, { exact: false });
    await expect(platformCard).toBeVisible();
    await platformCard.click();

    await expect(this.continueButton).toBeEnabled();
    await this.continueButton.click();

    return new ChoosePackagePage(this.page);
  }
}
