// pages/DraftsPage.js
import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

export default class DraftsPage extends BasePage {
  constructor(page) {
    super(page);

    // Draft items are rendered as cards. The button accessible name is "Publish"
    // (the "+" is an icon image, not text — getByRole strips it).
    // exact: true avoids matching the disabled "Publish Products" bulk-action button.
    this.publishButtons  = this.page.getByRole('button', { name: 'Publish', exact: true });
    // Actual toast: "Congratulations! Your product has been successfully published to the store..."
    this.successToast    = this.page.getByText(/successfully published to the store|Congratulations/i);
    // Import confirmation notification shown in the notification panel
    this.importConfirmed = this.page.getByText(/created successfully|variants imported/i);
  }

  async publishFirstDraft() {
    // Confirm at least one import notification is visible (Draft #xxx created successfully).
    // Use .first() — multiple draft cards may match the same regex (strict mode violation).
    await expect(this.importConfirmed.first()).toBeVisible({ timeout: 30_000 });

    // Wait for the Publish button on the first draft card
    await expect(this.publishButtons.first()).toBeEnabled({ timeout: 15_000 });
    await this.publishButtons.first().click();

    // Race success toast against any error/warning toast so failures are reported clearly.
    const errorToast = this.page.getByText(/error|failed|something went wrong|cannot publish|unable to publish/i).first();

    const result = await Promise.race([
      this.successToast.first().waitFor({ state: 'visible', timeout: 120_000 }).then(() => 'success'),
      errorToast.waitFor({ state: 'visible', timeout: 120_000 }).then(() => 'error'),
    ]);

    if (result === 'error') {
      const msg = await errorToast.textContent().catch(() => '(could not read error text)');
      throw new Error(`Publish failed — app showed error toast: "${msg}"`);
    }
  }

  async getDraftCount() {
    return await this.publishButtons.count();
  }
}
