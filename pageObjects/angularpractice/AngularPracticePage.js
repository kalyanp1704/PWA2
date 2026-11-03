const ANGULAR_PRACTICE_URL = 'https://rahulshettyacademy.com/angularpractice/';

class AngularPracticePage {
    constructor(page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto(ANGULAR_PRACTICE_URL);
    }

    async completePracticeForm({ password, gender }) {
        await this.page.getByLabel('Check me out if you Love IceCreams!').check();
        await this.page.getByLabel('Employed').check();
        await this.page.getByLabel('Gender').selectOption(gender);
        await this.page.getByPlaceholder('Password').fill(password);
        await this.page.getByRole('button', { name: 'Submit' }).click();
    }

    formSuccessMessage() {
        return this.page.getByText('Success! The Form has been submitted successfully!.');
    }

    async openShop() {
        await this.page.getByRole('link', { name: 'Shop' }).click();
    }

    async addProductToCart(productName) {
        await this.page
            .locator('app-card')
            .filter({ hasText: productName })
            .getByRole('button')
            .click();
    }

    async openCart() {
        await this.page.getByText('Checkout').click();
    }

    cartProduct(productName) {
        return this.page.getByText(productName, { exact: true });
    }

    async openCheckout() {
        await this.page.getByRole('button', { name: 'Checkout' }).click();
    }

    async selectDeliveryCountry(searchText, countryName) {
        const countryInput = this.page.getByRole('textbox', {
            name: /Please choose your delivery/,
        });
        await countryInput.click();
        await countryInput.pressSequentially(searchText);
        const countryOption = this.page
            .locator('.suggestions ul li a')
            .filter({ hasText: countryName });
        await countryOption.waitFor({ state: 'visible' });
        await countryOption.click();
    }

    async acceptTerms() {
        await this.page.getByText('I agree with the term &').click();
    }

    async purchase() {
        await this.page.getByRole('button', { name: 'Purchase' }).click();
    }

    purchaseSuccessMessage() {
        return this.page.getByText('× Success! Thank you! Your');
    }
}

module.exports = { AngularPracticePage };
