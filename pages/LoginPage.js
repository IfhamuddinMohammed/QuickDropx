// pages/LoginPage.js
import BasePage from './BasePage.js';

export default class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    this.emailInput = page.getByRole('textbox', { name: 'name@email.com' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'LOGIN' });
    this.dashboardHeading = page.getByRole('heading', {
      name: /Welcome back,/i
    });
  }

  async open() {
    await this.page.goto('/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    // ✅ Reliable login success signal
    await this.dashboardHeading.waitFor({ timeout: 45_000 });
  }
}

