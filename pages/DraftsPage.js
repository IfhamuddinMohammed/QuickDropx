// pages/DraftsPage.js
import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

export default class DraftsPage extends BasePage {
  constructor(page) {
    super(page);

    this.publishButton  = this.page.getByRole('button', { name: /^Publish$/i });
    this.successToast   = this.page.getByText(/published|success/i);
    this.draftRows      = this.page.locator('tbody tr');
  }

  async selectDraftByRowIndex(index = 0) {
    const row = this.draftRows.nth(index);
    await expect(row).toBeVisible({ timeout: 15_000 });

    const checkbox = row.locator('input[type="checkbox"]');
    await expect(checkbox).toBeVisible();
    await checkbox.check();
  }

  async selectMultipleDrafts(indices = [0]) {
    for (const index of indices) {
      await this.selectDraftByRowIndex(index);
    }
  }

  async publishSelectedDrafts() {
    await expect(this.publishButton).toBeEnabled({ timeout: 10_000 });
    await this.publishButton.click();

    // Wait for publish confirmation — replace hard wait with smart assertion
    await expect(this.successToast).toBeVisible({ timeout: 20_000 });
  }

  async getDraftCount() {
    return await this.draftRows.count();
  }
}
