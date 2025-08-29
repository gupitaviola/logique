// @ts-check
import {test,expect} from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { createPageWithBasicAuth } from "../utils/auth";
import {USERNAME, PASSWORD, AUCTION_EMAIL, AUCTION_PASSWORD} from "../config/env";
import { NavigationPage } from "../pages/NavigationPage";

test.describe("navigation menu", () => {
    let browser, context, page, loginPage, navigationPage;

    const email = AUCTION_EMAIL;
    const password = AUCTION_PASSWORD;

    test.beforeEach(async ({}) => {
        ({ browser, context, page } = await createPageWithBasicAuth(USERNAME, PASSWORD, false));
        
        loginPage = new LoginPage(page);

        // Wait for the login page to load
        await page.waitForURL(/login/, { timeout: 30000 });
        await expect(page.getByText(/Selamat\s+Datang/)).toBeVisible({ timeout: 15000 });

        const isLoggedIn = page.url().includes('/profil') || await page.getByText('Data Pribadi').isVisible();

        // If not logged in, perform login
        if (!isLoggedIn) {
            await loginPage.fillAuthentication(email, password);
            await loginPage.clickLoginButton();
            await loginPage.expectLoginSuccess();
        }

        // Initialize NavigationPage after login
        navigationPage = new NavigationPage(page);

    })

    test("User can open the Deposit page", async ({}) => {
        await navigationPage.goToDepositPage();
        await expect(page.getByRole('heading', {name: 'Deposit'})).toBeVisible();
    })

    test.afterEach(async () => {
        await loginPage.logout();
        await page.context().close();
        await browser.close();
    });
})