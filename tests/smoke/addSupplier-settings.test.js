import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import SuppliersSettingsPage from '../../pages/suppliersSettings.page.js';
import AddSupplierPage from '../../pages/addSupplier.page.js';
import ENV from '../../constants/env.js';
import buyerAccounts from '../../fixtures/BuyerAccounts.json' assert { type: 'json' };

test('add buyer account via suppliers settings (POM)', async ({ page }) => {
    test.setTimeout(180_000); // Amazon buyer login can take 1-2 min
    const login = new LoginPage(page);
    const suppliers = new SuppliersSettingsPage(page);
    const addSupplier = new AddSupplierPage(page);

    // Login
    await login.open();
    await login.login(ENV.defaultUserEmail, ENV.defaultUserPassword);

    // Navigate to Suppliers Settings and open the Add Account dialog
    await suppliers.open();
    await suppliers.clickAddAccount();

    // Supplier and region are the same for all candidates — set once
    await addSupplier.selectSupplier('Amazon');
    await addSupplier.selectRegion('Italy');

    // Try each buyer account until one is accepted.
    // The dialog stays open on "already exists" so we just refill and retry.
    const candidates = buyerAccounts.BuyerAccounts;
    let added = false;

    for (const candidate of candidates) {
        await addSupplier.fillBuyerEmail(candidate.email);
        await addSupplier.fillBuyerPassword(candidate.password);

        const result = await addSupplier.submitAndWaitForResult();

        if (result === 'duplicate') {
            // App shows "account already exists" notification — try next candidate
            continue;
        }

        // Login flow started — wait for success confirmation
        await addSupplier.waitForBuyerLoginSuccess();
        added = true;
        break;
    }

    if (!added) {
        throw new Error(
            'All buyer accounts in BuyerAccounts.json are already registered for Amazon Italy. ' +
            'Add a new account to the fixture to run this test.'
        );
    }

    // Verify the account appears in the approved accounts list
    await expect(addSupplier.approvedAccountsLocator()).toBeVisible();
});