import { expect } from "@playwright/test";

class NavigationPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        //this.profileMenu = page.locator('a[href="/profil/data-diri"]', {hasText: 'Data Diri'});
        this.depositMenu = page.locator('a[href="/profil/deposit"]', {hasText: 'Deposit'});
    }

    async goToDepositPage() {
        //await this.profileMenu.waitFor({ state: 'visible', timeout: 15000 })
        //await this.profileMenu.click();
        await this.depositMenu.waitFor({ state: 'visible', timeout: 15000 })
        await this.depositMenu.click();

        await expect(this.page).toHaveURL(/profil\/deposit/);
    }
}

export { NavigationPage };