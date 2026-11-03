const AUTOMATION_PRACTICE_URL = 'https://rahulshettyacademy.com/AutomationPractice/';

class AutomationPracticePage {
    constructor(page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto(AUTOMATION_PRACTICE_URL);
    }

    displayedTextbox() {
        return this.page.locator('#displayed-text');
    }

    async hideTextbox() {
        await this.page.locator('#hide-textbox').click();
    }

    acceptNextDialog() {
        this.page.once('dialog', dialog => dialog.accept());
    }

    async openConfirmDialog() {
        await this.page.locator('#confirmbtn').click();
    }

    async hoverMouseExample() {
        await this.page.locator('#mousehover').hover();
    }

    async openLifetimeCourseInFrame() {
        await this.page
            .frameLocator('#courses-iframe')
            .locator("li a[href*='lifetime-access']")
            .first()
            .click();
    }

    lifetimeCourseHeading() {
        return this.page
            .frameLocator('#courses-iframe')
            .getByRole('heading', { name: 'ALL ACCESS SUBSCRIPTION' });
    }

    async captureDisplayedTextbox(path) {
        await this.displayedTextbox().screenshot({ path });
    }

    async captureScreenshot(path) {
        await this.page.screenshot({ path });
    }
}

module.exports = { AutomationPracticePage };
