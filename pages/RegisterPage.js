// pages/RegisterPage.js
import BasePage from './BasePage.js';
import ChooseStorePage from './ChooseStorePage.js';
import { expect } from '@playwright/test';

export default class RegisterPage extends BasePage {
  constructor(page) {
    super(page);

    this.emailInput = page.locator('input[name="email"]');
    this.fullNameInput = page.locator('input[placeholder*="Full Name" i]');
    this.passwordInput = page.locator('input[placeholder*="password" i]').first();
    this.confirmPasswordInput = page.locator('input[placeholder*="confirm" i]');
    this.joinButton = page.getByRole('button', { name: /^join$/i });
  }

  async register({ email, fullName, password }) {
    // Email — MUST blur to trigger validation
    await expect(this.emailInput).toBeVisible();
    await this.emailInput.fill(email);
    await this.emailInput.press('Tab'); // 🔥 critical

    // Full name
    await this.fullNameInput.fill(fullName);
    await this.fullNameInput.press('Tab');

    // Password
    await this.passwordInput.fill(password);
    await this.passwordInput.press('Tab');

    // Confirm password
    await this.confirmPasswordInput.fill(password);
    await this.confirmPasswordInput.press('Tab');

    // Wait for React validation to complete
    await expect(this.joinButton).toBeEnabled({ timeout: 30_000 });

    await this.joinButton.click();

    return new ChooseStorePage(this.page);
  }
}
