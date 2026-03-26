// pages/LoginPage.js
import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

export default class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    this.emailInput    = page.locator('input[name="email"], input[type="email"]').first();
    // type="password" inputs are NOT textboxes in ARIA — must use locator, not getByRole
    this.passwordInput = page.locator('input[type="password"]').first();
    this.loginButton   = page.getByRole('button', { name: /^login$/i });
    this.dashboardHeading = page.getByRole('heading', { name: /Welcome back,/i });
  }

  async open() {
    await this.page.goto('/login');
  }

  async login(email, password) {
    await expect(this.emailInput).toBeVisible({ timeout: 15_000 });
    await this.emailInput.fill(email);

    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);

    await this.loginButton.click();

    // Reliable login success signal
    await this.dashboardHeading.waitFor({ timeout: 45_000 });
  }
}
