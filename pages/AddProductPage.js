// pages/AddProductPage.js
import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

export default class AddProductPage extends BasePage {
  constructor(page) {
    super(page);

    // Ensure we are on the correct screen
    this.addProductNav = page.getByRole('button', { name: /Add Product/i });

    // Tabs are usually buttons or tabs, not headings

        this.singleProductTab = page.getByText('Single Product', { exact: true });

  

    this.urlInput = page.getByRole('textbox', {
      name: /Enter URL|Enter URL or Product ID/i
    });

    this.addDraftButton = page.getByRole('button', { name: /Add Draft/i });

    // More specific + less noisy than div:has-text
    this.detectedSupplier = page.getByText(/Amazon/i);
    this.detectedRegion = page.getByText(/Italy/i);
  }

  async addDraftFromAmazon(url) {
    //go to Add Product page if not already there
       await this.addProductNav.click();

    await expect(this.singleProductTab).toBeVisible({ timeout: 30_000 });
    await this.singleProductTab.click();

    await expect(this.urlInput).toBeVisible();
    await this.urlInput.click();
    await this.urlInput.fill(url);
    await this.urlInput.press('Enter');

    await expect(this.detectedSupplier).toBeVisible({ timeout: 15_000 });



    // Wait for supplier detection (API response)
    await expect(this.page.getByText(/Amazon/i)).toBeVisible({ timeout: 20000 });

  // wait until Add Draft becomes enabled
  await expect(this.addDraftButton).toBeEnabled({ timeout: 20000 });

  await this.addDraftButton.click();
}
}
