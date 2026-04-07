export default class SuppliersSettingsPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.suppliersSettingsLink = page.getByRole('link', { name: 'Suppliers Settings' });
        this.addAccountButton = page.getByRole('button', { name: 'Add Account' });
    }

    async open() {
        await this.suppliersSettingsLink.click();
    }

    async clickAddAccount() {
        await this.addAccountButton.click();
    }

    approvedAccountsLocator() {
        return this.page.getByText('Approved Accounts Amazon(');
    }
}