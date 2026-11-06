
const { test, expect } = require("@playwright/test");

test.use({
    launchOptions: { slowMo: 2000 }
});

test("Sauce Labs - Sort products by price high to low", async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await page.locator('.product_sort_container').selectOption('hilo');

    const productNameAfterSort = await page.locator('.inventory_item_name').first().innerText();

    console.log(productNameAfterSort);

});
