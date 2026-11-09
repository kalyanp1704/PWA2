const { test, expect } = require('@playwright/test');
const { AngularPracticePage } = require('../pageObjects/angularpractice/AngularPracticePage');
const { ShopifyStorePage } = require('../pageObjects/shopify/ShopifyStorePage');

test.use({ launchOptions: { slowMo: 500 } });

test('Playwright Special locators', async ({ page }) => {
    test.setTimeout(60_000);
    const angularPracticePage = new AngularPracticePage(page);

    await angularPracticePage.goto();
    await angularPracticePage.completePracticeForm({
        password: 'abc123',
        gender: 'Female',
    });
    await expect(angularPracticePage.formSuccessMessage()).toBeVisible();

    await angularPracticePage.openShop();
    await angularPracticePage.addProductToCart('Nokia Edge');
    await angularPracticePage.openCart();
    await expect(angularPracticePage.cartProduct('Nokia Edge')).toBeVisible();
    await angularPracticePage.openCheckout();
    await angularPracticePage.selectDeliveryCountry('ind', 'India');
    await angularPracticePage.acceptTerms();
    await angularPracticePage.purchase();
    await expect(angularPracticePage.purchaseSuccessMessage()).toBeVisible();
});

test('Sauce Labs - Website', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
    });
    const page = await context.newPage();
    const shopifyStorePage = new ShopifyStorePage(page);

    await shopifyStorePage.gotoRegistration();
    await expect(shopifyStorePage.cartLink()).toBeVisible();
});

test.describe('Sauce Demo', () => {
    test('shows the registration form and home page product details', async ({ page }) => {
        const shopifyStorePage = new ShopifyStorePage(page);
        await page.setViewportSize({ width: 1920, height: 1080 });

        await shopifyStorePage.gotoRegistration();
        await expect(shopifyStorePage.registrationFirstName()).toBeVisible();
        await expect(shopifyStorePage.registrationLastName()).toBeVisible();
        await expect(shopifyStorePage.registrationEmail()).toBeVisible();

        await shopifyStorePage.gotoHome();
        await expect(shopifyStorePage.productLinks().first()).toBeVisible();

        const products = await shopifyStorePage.productDetails();
        expect(products).not.toHaveLength(0);
        console.log('Home page products:', products);
    });
});
