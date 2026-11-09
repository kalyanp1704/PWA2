const { test, expect } = require('@playwright/test');
const { CalendarPage } = require('../pageObjects/rahulshetty/CalendarPage');
const { AutomationPracticePage } = require('../pageObjects/rahulshetty/AutomationPracticePage');

test('Calender Validation', async ({ page }) => {
    const calendarPage = new CalendarPage(page);
    const monthNumber = '6';
    const date = '15';
    const year = '2027';
    const expectedDate = `${year}-${monthNumber.padStart(2, '0')}-${date.padStart(2, '0')}`;

    await calendarPage.gotoOffers();
    await calendarPage.selectDate(year, monthNumber, date);

    await expect(calendarPage.dateInput()).toHaveValue(expectedDate);
    await expect(calendarPage.monthInput()).toHaveValue(monthNumber);
    await expect(calendarPage.dayInput()).toHaveValue(date);
    await expect(calendarPage.yearInput()).toHaveValue(year);
});

test('Hidden/show validation', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
    });
    const page = await context.newPage();
    const automationPracticePage = new AutomationPracticePage(page);

    await automationPracticePage.goto();
    await expect(automationPracticePage.displayedTextbox()).toBeVisible();
    await automationPracticePage.hideTextbox();
    await expect(automationPracticePage.displayedTextbox()).toBeHidden();

    automationPracticePage.acceptNextDialog();
    await automationPracticePage.openConfirmDialog();
    await automationPracticePage.hoverMouseExample();
    await automationPracticePage.openLifetimeCourseInFrame();
    await expect(automationPracticePage.lifetimeCourseHeading()).toBeVisible();
});
