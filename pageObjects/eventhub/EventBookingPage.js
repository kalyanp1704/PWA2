class EventBookingPage {
    constructor(page) {
        this.page = page;
    }

    ticketCount() {
        return this.page.locator('#ticket-count');
    }

    async completeEventBooking({ name, email, phone }) {
        await this.page.locator('#customerName').fill(name);
        await this.page.locator('#customer-email').fill(email);
        await this.page.getByRole('textbox', { name: 'Phone Number*' }).fill(phone);
        await this.page.getByRole('button', { name: 'Confirm Booking' }).click();
        await this.bookingReference().waitFor({ state: 'visible' });
    }

    async completeStandardBooking({ name, email, phone }) {
        await this.page.getByLabel('Full Name').fill(name);
        await this.page.getByLabel('Email').fill(email);
        await this.page.getByLabel('Phone').fill(phone);
        await this.page.locator('.confirm-booking-btn').click();
    }

    async increaseTicketCount(count = 2) {
        const incrementButton = this.page.locator('button:has-text("+")');
        for (let index = 0; index < count; index += 1) {
            await incrementButton.click();
        }
    }

    bookingReference() {
        return this.page.locator('.booking-ref').first();
    }

    async openMyBookings() {
        await this.page.getByRole('button', { name: 'View My Bookings' }).click();
    }

    async openFirstBookingDetails() {
        await this.page.getByRole('link', { name: 'View Details' }).first().click();
    }

    async bookingReferenceText() {
        const bookingReference = this.bookingReference();
        if (await bookingReference.count()) {
            const confirmationText = await bookingReference.first().innerText();
            const confirmationMatch = confirmationText.match(/\b[A-Z]-[A-Z0-9]{6}\b/);
            if (confirmationMatch) {
                return confirmationMatch[0];
            }
        }

        const breadcrumbText = await this.page.locator('main nav').innerText();
        const bookingRef = breadcrumbText.match(/\b[A-Z]-[A-Z0-9]{6}\b/);
        if (!bookingRef) {
            throw new Error(`Could not find a booking reference in "${breadcrumbText}"`);
        }
        return bookingRef[0];
    }

    bookingInformation() {
        return this.page.getByText('Booking Information', { exact: true });
    }

    bookingEventTitle() {
        return this.page.locator('h1');
    }

    async checkRefundEligibility() {
        await this.page.getByRole('button', { name: /Check eligibility for refund/i }).click();
    }

    refundSpinner() {
        return this.page.locator('#refund-spinner');
    }

    refundResult() {
        return this.page.locator('#refund-result');
    }

    bookingCards() {
        return this.page.locator('#booking-card');
    }

    bookingWithReference(bookingRef) {
        return this.bookingCards().filter({
            has: this.page.locator('.booking-ref', { hasText: bookingRef }),
        });
    }
}

module.exports = { EventBookingPage };
