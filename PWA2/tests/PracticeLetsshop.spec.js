// @ts-check
import { test, expect } from '@playwright/test';

async function registerAndLogin(page) {
  const email = `testuser${Date.now()}@mailinator.com`;
  const password = `Test-${Date.now()}-Aa1!`;

  await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
  await page.locator("//a[@class='btn1']").click();
  await page.locator("#firstName").fill("Playwright");
  await page.locator("#lastName").fill("Test");
  await page.locator("#userEmail").fill(email);
  await page.locator("#userMobile").fill("1234567890");
  await page.locator("select.custom-select").selectOption("Student");
  await page.locator("//input[@value='Male']").click();
  await page.locator("#userPassword").fill(password);
  await page.locator("#confirmPassword").fill(password);
  await page.locator("//input[@type='checkbox']").check();
  await page.locator("#login").click();
  await expect(page.getByRole("heading", { name: "Account Created Successfully" })).toBeVisible();
  await page.getByRole("button", { name: "Login" }).click();
  await page.locator("#userEmail").fill(email);
  await page.locator("#userPassword").fill(password);
  await page.locator("#login").click();
  await expect(page.locator(".card-body").first()).toBeVisible();
}

test('Signup/in - grab the list of product in Lets shop(practice portal) ', async ({ browser }) => {

    const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

  const listproducts =page.locator("//h5[@style='text-transform: uppercase;']//b");
  await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
  await page.locator("//a[@class='btn1']").click();
  
//generate Tempmail and autofill
//   function generateTempEmail() {
//   const timestamp = Date.now();
//   return 'testuser${timestamp}@mailinator.com';
// }
 // const email = generateTempEmail();


  // Generate and store temp email
  const tempEmail =`testuser${Date.now()}@mailinator.com`;
  const password = `Test-${Date.now()}-Aa1!`;
  console.log("Temp Email:", tempEmail);
  
  await page.locator("#firstName").fill("Playwright");
  await page.locator("#lastName").fill("Test");
  console.log(await page.locator("#userEmail").fill(tempEmail));
  await page.locator("//input[@id='userMobile']").fill("1234567890");
  const dropdown = page.locator("select.custom-select.ng-untouched.ng-pristine.ng-valid");
  await dropdown.selectOption("Student");
  await page.locator("//input[@value='Male']").click();
  await page.locator("#userPassword").fill(password);
  await page.locator("#confirmPassword").fill(password);
  await page.locator("//input[@type='checkbox']").click();
  await page.locator("//input[@id='login']").click();
  await page.locator("//button[text()='Login']").click();
  console.log(await page.locator("//h1[text()='Log in']").textContent());

  //Login with tempmail
  await page.locator("#userEmail").fill(tempEmail);
  await page.locator("#userPassword").fill(password);
  await page.locator("//input[@id='login']").click();

  //until wait for the all the network API Calls
  await page.waitForLoadState("networkidle");

  await page.locator("//h3[text()='Automation']").textContent();
  const allProductTitles = await listproducts.allTextContents();
  console.log(allProductTitles);

});

test('To handle the Child Window/new tab in current browser', async ({ browser }) => {
 
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  const documentLink = page.locator("[href*='documents-request']");

    const [newPage]=await Promise.all(
   [
      context.waitForEvent('page'),   //Waits for a new page to be created to listen for any new page pending,rejected,fulfilled
      documentLink.click(),
   
   ])//new page is opened
   const text = await newPage.locator("//p[@class='im-para red']").textContent();
   console.log(text);
   
   // need to print the domin name of inside the string/sentence
//   const arrayText = text.split("@")
//   const domain = arrayText[1].split(" ")[0]
//   console.log("Extracted domain:", domain);
});

test('Signup/in - Check out the Product', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const productName = "ZARA COAT 3";
  await registerAndLogin(page);
  const products = page.locator(".card-body");
  const product = products.filter({ has: page.getByText(productName, { exact: true }) });
  await expect(product).toHaveCount(1);
  await product.getByRole("button", { name: /Add To Cart/i }).click();
  await page.locator("button[routerlink='/dashboard/cart']").click();
  await expect(page.locator("h3").filter({ hasText: productName })).toBeVisible();
  await page.getByRole("button", { name: "Checkout" }).click();
  await page.getByPlaceholder("Select Country").pressSequentially("ind");
  const dropdown = page.locator(".ta-results");
  const indiaOption = dropdown.getByRole("button", { name: /India$/ }).first();
  await expect(indiaOption).toBeVisible();
  await indiaOption.click();

  await page.locator(".action__submit").click();
  await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
  const orderId = (await page.locator(".em-spacer-1 .ng-star-inserted").textContent()) ?? '';
  await page.locator("button[routerlink*='myorders']").click();
  const rows = page.locator("tbody tr");
  await expect(rows.first()).toBeVisible();
  for (let i = 0; i < await rows.count(); ++i) {
    const rowOrderId = (await rows.nth(i).locator("th").textContent()) ?? '';
    if (orderId.includes(rowOrderId)) {
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }
  const orderIdDetails = (await page.locator(".col-text").textContent()) ?? '';
  expect(orderId.includes(orderIdDetails)).toBeTruthy();
});

test('@login and checkout the order - Special Locators', async ({ page }) => {
   const productName = 'ZARA COAT 3';
   await registerAndLogin(page);
   const products = page.locator(".card-body");
   const product = products.filter({ hasText: productName });
   await expect(product).toHaveCount(1);
   await product.getByRole("button", { name: /Add To Cart/i }).click();
   await page.locator("button[routerlink='/dashboard/cart']").click();
   await expect(page.getByText(productName, { exact: true })).toBeVisible();
   await page.getByRole("button", { name: "Checkout" }).click();
   await page.getByPlaceholder("Select Country").pressSequentially("ind");
   const indiaOption = page.locator(".ta-results").getByRole("button", { name: /India$/ }).first();
   await expect(indiaOption).toBeVisible();
   await indiaOption.click();
   await page.getByText("PLACE ORDER").click();
   await expect(page.getByText("Thankyou for the order.")).toBeVisible();
});
