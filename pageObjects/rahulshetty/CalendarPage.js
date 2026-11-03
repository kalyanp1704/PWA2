const OFFERS_URL = 'https://rahulshettyacademy.com/seleniumPractise/#/offers';

class CalendarPage {
    constructor(page) {
        this.page = page;
    }

    async gotoOffers() {
        await this.page.goto(OFFERS_URL);
    }

    async selectDate(year, monthNumber, date) {
        await this.page.locator('.react-date-picker__inputGroup').click();
        await this.page.locator('.react-calendar__navigation__label').click();
        await this.page.locator('.react-calendar__navigation__label').click();
        await this.page.getByText(year).click();
        await this.page
            .locator('.react-calendar__year-view__months__month')
            .nth(Number(monthNumber) - 1)
            .click();
        await this.page.locator(`//abbr[text()='${date}']`).click();
    }

    dateInput() {
        return this.page.locator('input[name="date"]');
    }

    monthInput() {
        return this.page.locator('input[name="month"]');
    }

    dayInput() {
        return this.page.locator('input[name="day"]');
    }

    yearInput() {
        return this.page.locator('input[name="year"]');
    }
}

module.exports = { CalendarPage };
