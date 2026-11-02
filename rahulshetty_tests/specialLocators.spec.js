import { test, expect } from '@playwright/test';

test.use({ launchOptions: { slowMo: 500 } });

test('Playwright Special locators', async ({ browser }) => {

    const context = await browser.newContext
    ({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Employed").check();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByPlaceholder("Password").fill("abc123");
    await page.getByRole("button", {name: 'Submit'}).click();
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();
    await page.getByRole("link",{name : "Shop"}).click();
    await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button").click();

    await page.getByText('Checkout').click();
    await expect(page.getByText('Nokia Edge')).toBeVisible();
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByRole('textbox', { name: 'Please choose your delivery' }).click();
    await page.getByRole('textbox', { name: 'Please choose your delivery' }).pressSequentially('ind');
    await page.getByText('India').click();
    await page.getByText('I agree with the term &').click();
    await page.getByRole('button', { name: 'Purchase' }).click();
    await page.getByText('× Success! Thank you! Your').click();
  
});



test("Sauce Labs - Website", async({ browser }) => {

    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }});
    const page = await context.newPage();

    await page.goto("https://sauce-demo.myshopify.com/account/register");

    //Assertions
    await expect(page.getByRole("link", { name: "My Cart (0)" })).toBeVisible();

});


test.describe("Sauce Demo", () => {
    test("shows the registration form and home page product details", async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });

        await page.goto("https://sauce-demo.myshopify.com/account/register");
        const registrationForm = page.locator("#create_customer");
        await expect(registrationForm.locator('[name="customer[first_name]"]')).toBeVisible();
        await expect(registrationForm.locator('[name="customer[last_name]"]')).toBeVisible();
        await expect(registrationForm.locator('[name="customer[email]"]')).toBeVisible();

        await page.goto("https://sauce-demo.myshopify.com/");
        const productLinks = page.locator('a[id^="product-"]');
        await expect(productLinks.first()).toBeVisible();

        const products = await productLinks.evaluateAll(links =>
            links.map(link => {
                const [name, price] = link.innerText.trim().split(/\r?\n/);
                return { name, price };
            })
        );

        expect(products).not.toHaveLength(0);
        console.log("Home page products:", products);
     });
});
