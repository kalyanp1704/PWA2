const {test, expect, request} = require('@playwright/test');
//const { ApiUtils } = require('./Utils/APIUtils');
const loginPayLoad = {
    userEmail: process.env.ECOMMERCE_TEST_EMAIL,
    userPassword: process.env.ECOMMERCE_TEST_PASSWORD
};
const orderPayLoad = {orders:[{country:"Cuba",productOrderedId:"67a8dde5c0d3e6622a297cc8"}]};

let response;
test.beforeAll( async()=>
{
    if (!loginPayLoad.userEmail || !loginPayLoad.userPassword) {
        throw new Error('Set ECOMMERCE_TEST_EMAIL and ECOMMERCE_TEST_PASSWORD to run this test.');
    }

    const apiContext = await request.newContext();
    const apiUtils = new ApiUtils(apiContext,loginPayLoad);
    response =  await apiUtils.createOrder(orderPayLoad);
 
})
 
//create order is success
test('@API Place the order', async ({page})=>
{ 
    await page.addInitScript(value => {
        window.localStorage.setItem('token',value);
    }, response.token );
    
await page.goto("https://rahulshettyacademy.com/client");
 await page.locator("button[routerlink*='myorders']").click();
 await page.locator("tbody").waitFor();
const rows = await page.locator("tbody tr");
 
 
for(let i =0; i<await rows.count(); ++i)
{
   const rowOrderId = await rows.nth(i).locator("th").textContent();
   if (response.orderId && response.orderId === rowOrderId) {
       await rows.nth(i).locator("button").first().click();
       break;
   }
}
const orderIdDetails =await page.locator(".col-text").textContent();
expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
});