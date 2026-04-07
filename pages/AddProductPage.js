// pages/AddProductPage.js
import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

export default class AddProductPage extends BasePage {
  constructor(page) {
    super(page);

    // Use placeholder — the label text ("Supplier URL or Product ID (Buy)")
    // is what getByRole uses for accessible name, not the placeholder.
    this.urlInput       = page.getByPlaceholder(/Enter URL or Product ID/i);
    this.addDraftButton = page.getByRole('button', { name: /Add Draft/i });

    // Success toast shown after the async import completes
    // Actual toast: "Product imported successfully and added to Drafts."
    this.importSuccessToast = page.getByText(/Product imported successfully|imported successfully and added to Drafts/i);
  }

  async addDraftFromAmazon(url, region = 'Italy') {
    // Clear any previous value before filling (handles retry after duplicate)
    await this.urlInput.clear();
    await this.urlInput.fill(url);

    // Scope all dropdown interactions to the dialog — the dashboard behind it
    // has its own comboboxes (Chart Type, Analytics Type) that would otherwise
    // be matched first by an unscoped getByRole('combobox').
    const dialog = this.page.getByRole('dialog');

    // Wait for Supplier Source to auto-populate with Amazon
    await expect(dialog.getByText(/Amazon/i).first()).toBeVisible({ timeout: 15_000 });

    // Give the app 5s to auto-detect the region from the URL.
    // If it doesn't, re-select Amazon to fire React-Select's onChange which
    // triggers region detection. Use ArrowDown (not just click) to actually
    // open the React-Select menu — clicking the combobox input only focuses it.
    const regionDetected = await dialog.getByText(region, { exact: true })
      .waitFor({ state: 'visible', timeout: 5_000 })
      .then(() => true)
      .catch(() => false);

    if (!regionDetected) {
      const supplierCombobox = dialog.getByRole('combobox').first();
      await supplierCombobox.click();
      await supplierCombobox.press('ArrowDown');
      // Options are plain divs inside a listbox — role="option" is not set in this build
      await this.page.getByRole('listbox').getByText('Amazon', { exact: true }).click();
    }

    // Wait for Italy to auto-populate in the Region field
    await expect(dialog.getByText(region)).toBeVisible({ timeout: 10_000 });

    // Race: the app may auto-submit once URL + region are set (no button click
    // required), OR the "Add Draft" button may appear and need to be clicked.
    const buttonReady = this.addDraftButton.waitFor({ state: 'visible', timeout: 15_000 })
      .then(() => 'button')
      .catch(() => 'no-button');

    const autoImported = this.importSuccessToast.waitFor({ state: 'visible', timeout: 15_000 })
      .then(() => 'auto')
      .catch(() => 'no-auto');

    const trigger = await Promise.race([buttonReady, autoImported]);

    if (trigger === 'auto') {
      // Form auto-submitted — import already completed
      return;
    }

    // Button appeared — click it
    await expect(this.addDraftButton).toBeEnabled({ timeout: 5_000 });
    await this.addDraftButton.click();

    // Race: either a duplicate/error toast or the import success toast appears.
    // Both are short-lived so we use Promise.race with manual polling.
    const duplicateToast = this.page.getByText(/already in your drafts|duplicate|already exists/i).first();
    const errorToast     = this.page.getByText(/error|failed|something went wrong/i).first();

    const result = await Promise.race([
      this.importSuccessToast.waitFor({ state: 'visible', timeout: 120_000 }).then(() => 'success'),
      duplicateToast.waitFor({ state: 'visible', timeout: 120_000 }).then(() => 'duplicate'),
      errorToast.waitFor({ state: 'visible', timeout: 120_000 }).then(() => 'error'),
    ]);

    if (result === 'duplicate') {
      throw new Error('DuplicateProductError');
    }
    if (result === 'error') {
      throw new Error('ImportError');
    }
    // result === 'success' — import completed
  }
}
