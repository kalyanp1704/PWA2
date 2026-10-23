const {test, expect} = require("@playwright/test");

test("Calender Validation", async({ page }) => {

     
    const monthNumber = "6";
    const date = "15";
    const year = "2027";
    const expectedDate = `${year}-${monthNumber.padStart(2, "0")}-${date.padStart(2, "0")}`;
    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    await page.locator(".react-date-picker__inputGroup").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.getByText(year).click();
    await page.locator(".react-calendar__year-view__months__month").nth(Number(monthNumber)-1).click();
    await page.locator("//abbr[text()='"+date+"']").click();
    
    //Assertion
    await expect(page.locator('input[name="date"]')).toHaveValue(expectedDate);
    await expect(page.locator('input[name="month"]')).toHaveValue(monthNumber);
    await expect(page.locator('input[name="day"]')).toHaveValue(date);
    await expect(page.locator('input[name="year"]')).toHaveValue(year);

});

test("Hidden/show validation", async({ browser }) => {

    const context = await browser.newContext
    ({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
   
    page.on('dialog', dialog => dialog.accept()); //To handle the java popup in Js -- dismiss/Cancel
    //To handle the java popup in Js -- Accept
    await page.locator("#confirmbtn").click();

    //Mouseover
    await page.locator("#mousehover").hover();

    //frames
    const framesPage = page.frameLocator("#courses-iframe");
    await framesPage.locator("li a[href*='lifetime-access']").first().click();
    await expect(framesPage.getByRole("heading", { name: "ALL ACCESS SUBSCRIPTION" })).toBeVisible();

});

    