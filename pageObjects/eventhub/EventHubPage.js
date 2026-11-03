const BASE_URL = 'https://eventhub.rahulshettyacademy.com';

class EventHubPage {
    constructor(page) {
        this.page = page;
    }

    async login(email, password) {
        await this.page.goto(BASE_URL);
        await this.page.getByRole('textbox', { name: 'Email' }).fill(email);
        await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
        await this.page.getByRole('button', { name: 'Sign In' }).click();
    }

    async openManageEvents() {
        await this.page.getByText('Admin', { exact: true }).nth(0).click();
        await this.page.getByText('Manage Events', { exact: true }).nth(0).click();
        await this.page.getByText('+ New Event').waitFor({ state: 'visible' });
    }

    async createEvent({ title, description, city, venue, date, price, seats }) {
        await this.page.locator('#event-title-input').fill(title);
        await this.page.getByPlaceholder('Describe the event…').fill(description);
        await this.page.locator('#city').fill(city);
        await this.page.locator('#venue').fill(venue);
        await this.page.getByLabel('Event Date & Time').fill(date);
        await this.page.getByLabel('Price ($)').fill(price);
        await this.page.locator('#total-seats').fill(seats);
        await this.page.getByTestId('add-event-btn').click();
    }

    eventCreatedMessage() {
        return this.page.getByText('✓Event created!');
    }

    async navigateToEvents() {
        await this.page.locator('#nav-events').click();
    }

    async gotoEvents() {
        await this.page.goto(`${BASE_URL}/events`);
    }

    eventCards() {
        return this.page.getByTestId('event-card');
    }

    eventCard(title) {
        return this.eventCards().filter({ hasText: title });
    }

    async seatCountForEvent(title) {
        const seatCountText = await this.eventCard(title).getByText(/seat/i).innerText();
        const seatCountMatch = seatCountText.match(/[\d,]+/);
        if (!seatCountMatch) {
            throw new Error(`Could not parse a seat count from "${seatCountText}"`);
        }
        return Number.parseInt(seatCountMatch[0].replace(/,/g, ''), 10);
    }

    async openBookingForEvent(title) {
        await this.eventCard(title).getByTestId('book-now-btn').click();
    }

    async openFirstEventBooking() {
        await this.eventCards().first().getByTestId('book-now-btn').click();
    }
}

module.exports = { EventHubPage };
