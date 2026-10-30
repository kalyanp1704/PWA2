const { test, expect } = require("@playwright/test");

test.use({
    launchOptions : ({ slowMo : 2000 }),

})

test("Sauce Labs", async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    const productSort = page.locator('[data-test="product-sort-container"]');
    await expect(productSort).toBeVisible();
    await productSort.selectOption('za');
    await expect(productSort).toHaveValue('za');
});
