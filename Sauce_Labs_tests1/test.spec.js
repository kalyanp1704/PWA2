const { test, expect } = require("@playwright/test");

test("Sauce Labs", async({ browser }) => {

    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }});
    const page = await context.newPage();

    await page.goto("https://sauce-demo.myshopify.com/account/register");

    //Assertions
    await expect(page.getByRole("link", { name: "My Cart (0)" })).toBeVisible();

});
