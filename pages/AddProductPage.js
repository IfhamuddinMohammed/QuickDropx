// pages/AddProductPage.js
import BasePage from './BasePage.js';

export default class AddProductPage extends BasePage {
  constructor(page) {
    super(page);

    this.singleProductTab = page.getByRole('heading', { name: 'Single Product' });

    this.urlInput = page.getByRole('textbox', {
      name: /Enter URL|Enter URL or Product ID/i
    });

    this.addDraftButton = page.getByRole('button', { name: 'Add Draft' });

    this.detectedSupplier = page.locator("div:has-text('Amazon')");
    this.detectedRegion = page.locator("div:has-text('Italy')");
  }

  async addDraftFromAmazon(url) {
    await this.singleProductTab.click();
    await this.urlInput.fill(url);

    await this.detectedSupplier.waitFor({ timeout: 5000 });
    await this.detectedRegion.waitFor({ timeout: 5000 });

    await this.addDraftButton.click();
    await this.page.waitForTimeout(3000);
  }
}
