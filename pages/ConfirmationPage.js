// pages/ConfirmationPage.js
import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

export default class ConfirmationPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async expectConfirmationVisible() {
    await expect(
      this.page.getByText(/thank you for your purchase/i)
    ).toBeVisible();
  }
}

