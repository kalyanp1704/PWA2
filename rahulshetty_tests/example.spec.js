const { test, expect } = require('@playwright/test');
const { ProtoCommerceLoginPage } = require('../pageObjects/rahulshetty/ProtoCommerceLoginPage');

test('Negative Case - To Validate the error/toast Message', async ({ page }) => {
    const loginPage = new ProtoCommerceLoginPage(page);

    await loginPage.goto();
    await loginPage.login('Sivakalyan1704', 'invalid-password');

    await expect(loginPage.errorMessage()).toContainText('Incorrect');
});

test('Signup - grab the list of product in ProtoCommerce ', async ({ page }) => {
    const loginPage = new ProtoCommerceLoginPage(page);

    await loginPage.goto();
    await loginPage.login('rahulshettyacademy', 'Learning@830$3mK2');
    await expect(loginPage.protoCommerceLink()).toContainText('ProtoCommerce');

    const productTitles = loginPage.productTitles();
    await expect(productTitles.first()).toBeVisible();
    console.log(await productTitles.allTextContents());
});
