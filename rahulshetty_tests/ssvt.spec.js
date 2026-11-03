const { test, expect } = require('@playwright/test');
const { AutomationPracticePage } = require('../pageObjects/rahulshetty/AutomationPracticePage');

test('Screenshot/Visual testing', async ({ page }) => {
    const automationPracticePage = new AutomationPracticePage(page);

    await automationPracticePage.goto();
    await expect(automationPracticePage.displayedTextbox()).toBeVisible();
    await automationPracticePage.captureDisplayedTextbox('PartialScreenshot.png');
    await automationPracticePage.hideTextbox();
    await automationPracticePage.captureScreenshot('screenshot.png');
    await expect(automationPracticePage.displayedTextbox()).toBeHidden();
});
