// @ts-check
import {test,expect} from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { createPageWithBasicAuth } from "../utils/auth";
import {USERNAME, PASSWORD, AUCTION_EMAIL, AUCTION_PASSWORD} from "../config/env";

test.describe("login", () => {
    let browser, context, page, loginPage;

    const email = AUCTION_EMAIL;
    const password = AUCTION_PASSWORD;

    test.beforeEach(async ({}) => {
        ({ browser, context, page } = await createPageWithBasicAuth(USERNAME, PASSWORD, false));
        
        loginPage = new LoginPage(page);
        
        // Wait for the login page to load
        await page.waitForURL(/login/, { timeout: 30000 });
        await expect(page.getByText(/Selamat\s+Datang/)).toBeVisible({ timeout: 15000 });
    })

    test("User can login with valid credentials", async ({}) => {
        // Fill email & password
        await loginPage.fillAuthentication(email, password);

        // verify email and password is filled
        await expect(loginPage.emailInput).toHaveValue(email);
        await expect(loginPage.passwordInput).toHaveValue(password);
        
        // Click login button
        await loginPage.clickLoginButton();

        // Verify login success
        await loginPage.expectLoginSuccess();
    })

    test.afterEach(async () => {
        await loginPage.logout();
        await page.context().close();
        await browser.close();
    });
})