import { test, expect } from '@playwright/test';
 
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

