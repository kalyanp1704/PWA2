const {test, expect} = require("@playwright/test");

test("Screenshot/Visual testing", async({ browser }) => {

    const context = await browser.newContext
    ({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#displayed-text").screenshot({path:'PartialScreenshot.png'}); //Partial Screenshot
    page.locator("#hide-textbox").click();
    await page.screenshot({path:'screenshot.png'}); // full page Screenshot
    await expect(page.locator("#displayed-text")).toBeHidden();
});

