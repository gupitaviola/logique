import { expect } from "@playwright/test";

class RegisterPage {
    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;
        this.registerLink = page.locator("a", {hasText: "Daftar Sekarang"});
        this.formTitle = page.getByText('Form Pendaftaran');
        this.firstNameInput = page.getByPlaceholder('Nama Depan');
        this.lastNameInput = page.getByPlaceholder('Nama Belakang');
        this.birthPlaceInput = page.getByPlaceholder('Tempat Lahir');
        this.birthDateInput = page.locator('input[placeholder="DD/MM/YYYY"]').first();
        this.nomorKTPInput = page.getByPlaceholder('Nomor KTP');
        this.ktpInput = page.locator('input[type="file"]');
        this.checkboxSeumurHidup = page.locator('div', {hasText:'Berlaku Seumur Hidup'}).locator('input[type="checkbox"]');
        this.nomorTeleponInput = page.getByRole('textbox', {name:'Nomor Telepon', exact: true});
        this.addressInput = page.locator('textarea').first();
        this.accountNumberInput = page.getByPlaceholder('Nomor Rekening');
        this.accountHolderNameInput = page.getByPlaceholder('Nama Pemilik Rekening');
        this.nextButton = page.getByRole('button', {name: 'Selanjutnya'});
        this.registerButton = page.getByRole('button', {name: 'Daftar'});
    }

    async openRegistrationPage() {
        await expect(this.registerLink).toBeVisible();
        await this.registerLink.click();
    }


    /**
     * @param {string} firstName 
     * @param {string} lastName 
     * @param {string} birthPlace 
     * @param {string|number} birthDay 
     * @param {string} nomorKtp 
     * @param {string} ktpFile 
     */
    async fillPersonalData(firstName, lastName, birthPlace, birthDay, nomorKtp, ktpFile) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.birthPlaceInput.fill(birthPlace);

        await this.birthDateInput.click();

        const dayCell = this.page.locator('[role="gridcell"]', { hasText: birthDay }).first();
        await dayCell.waitFor({ state: 'visible', timeout: 5000 });

        // klik hari
        await dayCell.click();

        //klik select
        const selectBtn = this.page.locator('span.dp__action.dp__select', { hasText: 'Select' }).first();
        await selectBtn.waitFor({ state: 'visible', timeout: 5000 });
        await selectBtn.click();

        await this.nomorKTPInput.fill(nomorKtp);
        await this.ktpInput.setInputFiles(ktpFile);
        const fileName = ktpFile.split('/').pop();
        await expect(this.page.locator(`text=${fileName}`)).toBeVisible();
        await this.checkboxSeumurHidup.check();
    }

    /**
     * 
     * @param {string} province 
     * @param {string} city 
     * @param {string} address 
     * @param {string} phone 
     */
    async fillAddressData(province, city, address, phone) {
        // Pilih Provinsi
        await this.page.locator('input[aria-placeholder="Pilih Provinsi"]').click();
        await this.page.locator(`#multiselect-options >> text=${province}`).click(); 

        // Pilih Kota
        await this.page.locator('input[aria-placeholder="Pilih Kota"]').click();
        await this.page.locator(`#multiselect-options >> text=${city}`).click(); 
        
        await this.addressInput.fill(address);
        await this.nomorTeleponInput.fill(phone);
    }

    /**
     * 
     * @param {string} job 
     * @param {string} vehicleType 
     * @param {string} vehicle 
     * @param {string} purpose 
     */
    async fillJobAndVehicle(job, vehicleType, vehicle, purpose) {
        // Pilih Pekerjaan
        await this.page.locator('input[aria-placeholder="Pilih Pekerjaan"]').click();
        await this.page.locator(`#multiselect-options >> text=${job}`).click(); 

        // Pilih Jenis Kendaraan
        await this.page.locator('input[aria-placeholder="Jenis Kendaraan"]').click();
        await this.page.locator(`#multiselect-options >> text=${vehicleType}`).click(); 

        // Pilih Kendaraan
        await this.page.locator('input[aria-placeholder="Pilih Kendaraan"]').click();
        await this.page.locator(`#multiselect-options >> text=${vehicle}`).click(); 

        // Pilih Tujuan
        await this.page.locator('input[aria-placeholder="Pilih Tujuan"]').click();
        await this.page.locator(`#multiselect-options >> text=${purpose}`).click(); 
    }

    /**
     * 
     * @param {string} email 
     * @param {string} password 
     */
    async fillAuthenticationData(email, password) {
        await this.page.getByPlaceholder('Email').fill(email);
        await this.page.getByPlaceholder('Masukkan Kata Sandi Baru').fill(password);
        await this.page.getByPlaceholder('Masukkan Ulang Kata Sandi Baru').fill(password);
    }

    /**
     * 
     * @param {string} accountNumber 
     * @param {string} bank 
     * @param {string} accountHolderName 
     * @param {string} accountSource 
     * @param {string} paymentMethod 
     */
    async fillAccountData(accountNumber, bank, accountHolderName, accountSource, paymentMethod) {
        await this.accountNumberInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.accountNumberInput.fill(accountNumber);
        // Pilih Bank
        await this.page.locator('input[aria-placeholder="Pilih Bank"]').click();
        await this.page.locator(`#multiselect-options >> text=${bank}`).click();

        await this.accountHolderNameInput.fill(accountHolderName);

        // Pilih Sumber Tabungan
        await this.page.locator('input[aria-placeholder="Pilih Sumber Tabungan"]').click();
        await this.page.locator(`#multiselect-options >> text=${accountSource}`).click();

        // Pilih Metode Pembayaran
        await this.page.locator('input[aria-placeholder="Pilih Metode Pembayaran"]').click();
        await this.page.locator(`#multiselect-options >> text=${paymentMethod}`).click();
    }

    async clickNextButton() {
        await this.nextButton.click();
    }

    async expectNextButtonSuccess() {
        await expect(this.page.getByText("Info Nomor Rekening")).toBeVisible();
        await this.accountNumberInput.waitFor({ state: 'visible', timeout: 10000 });
    }

    async clickRegisterButton() {
        await this.registerButton.click();
    }

    async expectRegistrationSuccess() {
        await expect(this.page.getByText("Selamat  Datang")).toBeVisible({timeout: 10000});
        await expect(this.page).toHaveURL(/login/);
    }
}

export {RegisterPage};