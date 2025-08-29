import { expect } from "@playwright/test";

class LoginPage {
    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;
        this.emailInput = page.locator('input[type="email"][name="email"]');
        this.passwordInput = page.locator('input[type="password"][name="password"]');
        this.recaptchaFrame = page.frameLocator('iframe[title="reCAPTCHA"]');
        this.loginButton = page.locator('button:has-text("Masuk")');
        this.rememberMeCheckbox = page.locator('#remember_me');
        this.logoutButton = page.locator('button', { hasText: "Keluar"});
    }

    async basicAuthLogin() {
        // Page is already created with HTTP auth
        await this.page.goto('https://auction.lelangmobilku.co.id');
        await expect(this.page).toHaveTitle(/Login/);
    }

    /**
     * Login with the given credentials
     * @param {string} email - The username to use
     * @param {string} password - The password to use
     */
    async fillAuthentication(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.rememberMeCheckbox.check();

        //Pause before CAPTCHA (manual intervention)
        console.log("Please solve the CAPTCHA manually before continuing the test.");
        await this.page.pause();
    }

    async clickLoginButton() {
        await this.loginButton.click();
    }

    async expectLoginSuccess() {
        await expect(this.page).toHaveURL(/profil/, {timeout: 10000});
        await expect(this.page.getByText("Data Pribadi")).toBeVisible({timeout: 10000});
    }

    // Verify login error (example: invalid credentials)
    async expectLoginError(message) {
        await expect(this.page.getByText(message)).toBeVisible();
    }

    async logout() {
        await expect(this.logoutButton).toBeVisible();
        await this.logoutButton.click();
        await this.page.waitForURL(/login/); // pastikan redirect ke login
    }
}

export { LoginPage };