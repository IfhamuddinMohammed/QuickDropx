import { expect } from '@playwright/test';

export default class AddSupplierPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.supplierOption = (name) => page.getByText(`Supplier * ${name}`);
        this.regionOption = (name) => page.getByText(`Region * ${name}`);
        this.buyerEmail = page.getByRole('textbox', { name: 'Enter your email' });
        this.buyerPassword = page.getByRole('textbox', { name: 'Type Your Password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.attemptingText = page.getByText('Attempting to log in, please');
        this.buyerSuccessText = page.getByText('Buyer login successful');
    }

    async selectSupplier(name) {
        await this.supplierOption(name).click();
    }

    async selectRegion(name) {
        await this.regionOption(name).click();
    }

    async fillBuyerEmail(email) {
        await this.buyerEmail.click();
        await this.buyerEmail.fill(email);
    }

    async fillBuyerPassword(password) {
        await this.buyerPassword.click();
        await this.buyerPassword.fill(password);
    }

    async submitBuyerLogin() {
        await this.loginButton.click();
    }

    // Clicks Login and races the success indicator against the "already exists" error.
    // Returns 'attempting' if the login flow started, or 'duplicate' if the account
    // is already registered for this supplier + region.
    async submitAndWaitForResult() {
        await this.loginButton.click();
        const alreadyExistsNotice = this.page.getByText(/already exists for the selected supplier/i);
        const result = await Promise.race([
            this.attemptingText.waitFor({ state: 'visible', timeout: 15_000 }).then(() => 'attempting'),
            alreadyExistsNotice.waitFor({ state: 'visible', timeout: 15_000 }).then(() => 'duplicate'),
        ]);
        return result;
    }

    async waitForAttemptingLogin(timeout = 15000) {
        await expect(this.attemptingText).toBeVisible({ timeout });
    }

    async waitForBuyerLoginSuccess(timeout = 120_000) {
        // Amazon login is slow — race success against known failure states so a real
        // error surfaces immediately rather than waiting out the full timeout.
        const failureText = this.page.getByText(/login failed|invalid credentials|failed to log in|incorrect/i);
        const result = await Promise.race([
            this.buyerSuccessText.waitFor({ state: 'visible', timeout }).then(() => 'success'),
            failureText.waitFor({ state: 'visible', timeout }).then(() => 'failure'),
        ]);
        if (result === 'failure') {
            const msg = await failureText.first().textContent().catch(() => '(could not read error)');
            throw new Error(`Buyer login failed — app showed: "${msg}"`);
        }
    }

    approvedAccountsLocator() {
        return this.page.getByText('Approved Accounts Amazon(');
    }
}