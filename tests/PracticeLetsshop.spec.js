const { test, expect } = require('@playwright/test');
const { ProtoCommerceLoginPage } = require('../pageObjects/rahulshetty/ProtoCommerceLoginPage');
const { ClientPortalPage } = require('../pageObjects/rahulshetty/ClientPortalPage');

test('Signup/in - grab the list of product in Lets shop(practice portal) ', async ({ page }) => {
    const clientPortalPage = new ClientPortalPage(page);
    const email = `testuser${Date.now()}@mailinator.com`;
    const password = `Test-${Date.now()}-Aa1!`;

    await clientPortalPage.registerAndLogin({
        firstName: 'Playwright',
        lastName: 'Test',
        mobile: '1234567890',
        email,
        password,
    });

    console.log('Temp Email:', email);
    console.log(await clientPortalPage.productTitles());
});

test('To handle the Child Window/new tab in current browser', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
    });
    const page = await context.newPage();
    const loginPage = new ProtoCommerceLoginPage(page);

    await loginPage.goto();
    const documentText = await loginPage.openDocumentsRequest(context);
    console.log(documentText);
});

test('Signup/in - Check out the Product', async ({ page }) => {
    const clientPortalPage = new ClientPortalPage(page);
    const email = `testuser${Date.now()}@mailinator.com`;
    const password = `Test-${Date.now()}-Aa1!`;
    const productName = 'ZARA COAT 3';

    await clientPortalPage.registerAndLogin({
        firstName: 'Playwright',
        lastName: 'Test',
        mobile: '1234567890',
        email,
        password,
    });

    const product = clientPortalPage.productCard(productName);
    await expect(product).toHaveCount(1);
    await clientPortalPage.addProductToCart(productName);
    await clientPortalPage.openCart();
    await expect(clientPortalPage.cartProduct(productName)).toBeVisible();
    await clientPortalPage.startCheckout();
    await clientPortalPage.selectCountry('ind', 'India');
    await clientPortalPage.placeOrder();
    await expect(clientPortalPage.orderConfirmation()).toHaveText(' Thankyou for the order. ');

    const orderId = await clientPortalPage.orderId();
    await clientPortalPage.openMyOrders();
    await clientPortalPage.openOrderDetails(orderId);
    expect(orderId.includes(await clientPortalPage.orderDetailsId())).toBeTruthy();
});

test('login and checkout the order - Special Locators @login', async ({ page }) => {
    const clientPortalPage = new ClientPortalPage(page);
    const email = `testuser${Date.now()}@mailinator.com`;
    const password = `Test-${Date.now()}-Aa1!`;
    const productName = 'ZARA COAT 3';

    await clientPortalPage.registerAndLogin({
        firstName: 'Playwright',
        lastName: 'Test',
        mobile: '1234567890',
        email,
        password,
    });

    await expect(clientPortalPage.productCard(productName)).toHaveCount(1);
    await clientPortalPage.addProductToCart(productName);
    await clientPortalPage.openCart();
    await expect(clientPortalPage.cartProduct(productName)).toBeVisible();
    await clientPortalPage.startCheckout();
    await clientPortalPage.selectCountry('ind', 'India');
    await clientPortalPage.placeOrder();
    await expect(clientPortalPage.orderConfirmation()).toBeVisible();
});
