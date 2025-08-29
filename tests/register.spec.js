// @ts-check
import {test,expect} from "@playwright/test";
import { RegisterPage } from "../pages/RegisterPage";
import { LoginPage } from "../pages/LoginPage";
import { createPageWithBasicAuth } from "../utils/auth";
import {USERNAME, PASSWORD} from "../config/env";


test.describe("register new account", () => {
    let browser, context, page, loginPage, registerPage;

    test.beforeEach("should login", async ({}) => {
        ({ browser, context, page } = await createPageWithBasicAuth(USERNAME, PASSWORD, false));
        loginPage = new LoginPage(page);
        registerPage = new RegisterPage(page);

        // Wait for the login page to load
        await expect(page).toHaveTitle(/Login/);
    })

    test("User can register new account", async ({}) => {
        // Dynamic user data
        const email = `user${Date.now()}@example.com`;
        const phone = `08${Date.now().toString().slice(-10)}`;
        const nomorKTP = `330${Date.now().toString().slice(-14)}`; 

        // Navigate to registration page
       // const registerLink = page.locator("a", {hasText: "Daftar Sekarang"});
       // await expect(registerLink).toBeVisible();
       // await registerLink.click();
        await registerPage.openRegistrationPage();

        //Verify registration page
        await expect(page).toHaveURL(/register/);
        await expect(page.getByText("Form Pendaftaran")).toBeVisible();

        // Fill registration form
        await registerPage.fillPersonalData('Viola', 'Putri', 'Semarang', '1', nomorKTP, 'tests/fixtures/ktp_sample.jpg');
        await registerPage.fillAddressData('DI Yogyakarta', 'Kota Yogyakarta', 'Jl. Suprapto No. 12',phone);
        await registerPage.fillJobAndVehicle('Wiraswasta', 'Mobil dan Motor', 'Kendaraan Penumpang', 'Pribadi')
        await registerPage.fillAuthenticationData(email, 'password123')

        // Next step
        await registerPage.clickNextButton();
        await registerPage.expectNextButtonSuccess();

        // Account Details
        await registerPage.fillAccountData('222222222', 'BANK LIPPO', 'Viola', 'Tabungan', 'Bank Transfer')
    
        // Click register button
        await registerPage.clickRegisterButton();
        await registerPage.expectRegistrationSuccess();

    })

    test.afterEach(async () => {
        await page.context().close();
    });
})