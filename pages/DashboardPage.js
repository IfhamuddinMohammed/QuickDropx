// pages/DashboardPage.js
import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

export default class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.overviewHeading = page.getByRole('heading', {
      name: /Overview Dashboard/i
    });
  }

  async expectOverviewVisible() {
    await expect(this.overviewHeading).toBeVisible();
  }

  async openAddProduct() {
    await this.page.goto('/add-product');
  }

  async goToDrafts() {
    await this.page.goto('/drafts?page=1&limit=10&tab=drafts');
  }
}
