// pages/DashboardPage.js
import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

export default class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.overviewHeading = page.getByRole('heading', {
      name: /Welcome back,/i
    });
  }

  async expectOverviewVisible() {
    // Dashboard can take time to load after signup/payment redirect
    await expect(this.overviewHeading).toBeVisible({ timeout: 30_000 });
  }

  async openAddProduct() {
    // The "Add Product" is a sidebar dropdown, not a route.
    // Click the button, then choose "Single Product" from the flyout.
    await this.page.getByRole('button', { name: /Add Product/i }).click();
    await this.page.getByText('Single Product', { exact: true }).click();
  }

  async goToDrafts() {
    await this.page.goto('/drafts?tab=drafts&page=1&limit=10');
  }
}
