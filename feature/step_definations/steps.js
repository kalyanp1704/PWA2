//import the files
const { When, Then, Given } = require('@cucumber/cucumber')
const { POManager }  = require('../../pageObjects/POManager')
const { test, expect, playwright } = require('@playwright/test')

Given('Login to the Ecommerce application with {username} and {password}', async function(username, password){
    
    const browser = await playwright.chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    const product = page.locator(".card-body");
    const loginPage = new oginPage(page);
    await loginPage.goTo();
    await loginPage.validLogin(username, password);

});

When('Add the product {productName} to the cart', function(productName) {
    //Write a logic
    return 'pending';   
});

Then('verify {productName} is displayed in Cart', function(productName) {
    //Write a logic
    return 'pending';   
});

When('enter valid details and place a order', function() {
    //Write a logic
    return 'pending';   
});

Then('verify order in present in the OrderHistory', function() {
    //Write a logic
    return 'pending';   
});