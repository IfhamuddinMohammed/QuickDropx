// pages/DraftsPage.js
import BasePage from './BasePage.js';

export default class DraftsPage extends BasePage {
  constructor(page) {
    super(page);

    this.publishButton = page.locator('button:has-text("Publish")');
  }

  async selectDraftByRowIndex(index = 0) {
    const checkbox = this.page
      .locator('tbody tr')
      .nth(index)
      .locator('input[type="checkbox"]');

    await checkbox.waitFor();
    await checkbox.check();
  }

  async publishSelectedDrafts() {
    await this.publishButton.waitFor();
    await this.publishButton.click();
    await this.page.waitForTimeout(3000);
  }
}
