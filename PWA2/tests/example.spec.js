// @ts-check
import { test, expect } from '@playwright/test';
test('Negative Case - To Validate the error/toast Message', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  console.log(await page.title());
  await page.locator('#username').fill("Sivakalyan1704");
  await page.locator('#password').fill('invalid-password');
  await page.locator('#terms').click();
  await page.locator('#signInBtn').click();

  //textContent() --to validate the error/toast messages
  console.log(await page.locator("[style*='block']").textContent());
  
  //Assertion - to validate the String by using toContainText()
  expect(page.locator("[style*='block']")).toContainText('Incorrect');
});

test('Signup - grab the list of product in ProtoCommerce ', async ({ browser }) => {

  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  console.log(await page.title());
  const UserName = page.locator('#username');
  const Pwd = page.locator('#password');
  const CheckBox = page.locator('#terms');
  const SignupBtn = page.locator('#signInBtn');
  const allTitles = page.locator("//div[@class='card-body']//a");
  await UserName.fill("rahulshettyacademy");
  await Pwd.fill("Learning@830$3mK2");
  await CheckBox.click();
  await SignupBtn.click();
  await expect(page.locator("//a[text()='ProtoCommerce']")).toContainText('ProtoCommerce');

  //it will get the tile of first product of the application
  // console.log(await page.locator("(//div[@class='card-body']//a)[1]").textContent()); 

  await expect(allTitles.first()).toBeVisible();
  const allProductTitles = await allTitles.allTextContents();
  console.log(allProductTitles);
  
});
