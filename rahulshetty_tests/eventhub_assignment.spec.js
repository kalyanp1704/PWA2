const { test, expect } = require('@playwright/test');
const { EventHubPage } = require('../pageObjects/eventhub/EventHubPage');
const { EventBookingPage } = require('../pageObjects/eventhub/EventBookingPage');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const eventTitle = `Test${Date.now()}-kalyan`;

test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
});

function getUserEmail() {
    const email = process.env.EVENTHUB_EMAIL;
    if (!email) {
        throw new Error('Set EVENTHUB_EMAIL before running the EventHub tests.');
    }
    return email;
}

async function loginAndGoToBooking(page) {
    const eventHubPage = new EventHubPage(page);
    const eventBookingPage = new EventBookingPage(page);

    await expect(page.getByText('Browse Events →', { exact: true })).toBeVisible();
    await eventHubPage.gotoEvents();
    await eventHubPage.openFirstEventBooking();

    return eventBookingPage;
}

test('Verify home page', async ({ page }) => {
    test.setTimeout(120_000);

    await page.setViewportSize({ width: 1980, height: 1080 });

    const eventHubPage = new EventHubPage(page);
    const eventBookingPage = new EventBookingPage(page);

    await eventHubPage.openManageEvents();
    await eventHubPage.createEvent({
        title: eventTitle,
        description: 'This is SK Event Kitchen clubs.',
        city: 'Hyderabad',
        venue: 'AMB Mall - Sarath Capital City',
        date: '2027-12-31T12:00',
        price: '1000',
        seats: '555',
    });

    await expect(eventHubPage.eventCreatedMessage()).toBeVisible();
    await eventHubPage.navigateToEvents();

    await expect(eventHubPage.eventCards().first()).toBeVisible();

    await expect(eventHubPage.eventCard(eventTitle)).toBeVisible({ timeout: 5_000 });
    const seatsBeforeBooking = await eventHubPage.seatCountForEvent(eventTitle);
    await eventHubPage.openBookingForEvent(eventTitle);
    await expect(eventBookingPage.ticketCount()).toHaveText('1');
    await eventBookingPage.completeEventBooking({
        name: 'Siva Kalyan',
        email: getUserEmail(),
        phone: '9876543211',
    });

    const bookingRef = await eventBookingPage.bookingReferenceText();
    console.log('Booking Reference:', bookingRef);

    await eventBookingPage.openMyBookings();
    await expect(page).toHaveURL(/\/bookings(?:[?#].*)?$/);

    await expect(eventBookingPage.bookingCards().first()).toBeVisible();

    const matchedBooking = eventBookingPage.bookingWithReference(bookingRef);
    await expect(matchedBooking).toBeVisible();
    await expect(matchedBooking).toContainText(eventTitle);

    await eventHubPage.gotoEvents();
    await expect(eventHubPage.eventCards().first()).toBeVisible();

    await expect(eventHubPage.eventCard(eventTitle)).toBeVisible();
    const seatsAfterBooking = await eventHubPage.seatCountForEvent(eventTitle);

    console.log('Seats before booking:', seatsBeforeBooking);
    console.log('Seats after booking:', seatsAfterBooking);
    expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
});

test('Single ticket booking is eligible for refund', async ({ page }) => {
    test.setTimeout(120_000);
    const eventBookingPage = await loginAndGoToBooking(page);

    await eventBookingPage.completeStandardBooking({
        name: 'Siva Kalyan',
        email: getUserEmail(),
        phone: '9876543210',
    });

    await eventBookingPage.openMyBookings();
    await expect(page).toHaveURL(/\/bookings(?:[?#].*)?$/);
    await eventBookingPage.openFirstBookingDetails();
    await expect(eventBookingPage.bookingInformation()).toBeVisible();

    const bookingRef = await eventBookingPage.bookingReferenceText();
    const eventTitle = (await eventBookingPage.bookingEventTitle().innerText()).trim();
    expect(bookingRef[0]).toBe(eventTitle[0]);

    await eventBookingPage.checkRefundEligibility();
    await expect(eventBookingPage.refundSpinner()).toBeVisible();
    await expect(eventBookingPage.refundSpinner()).toBeHidden({ timeout: 6_000 });

    const refundResult = eventBookingPage.refundResult();
    await expect(refundResult).toBeVisible();
    await expect(refundResult).toContainText('Eligible for refund');
    await expect(refundResult).toContainText('Single-ticket bookings qualify for a full refund');
});

test('Group ticket booking is not eligible for refund', async ({ page }) => {
    test.setTimeout(120_000);
    const eventBookingPage = await loginAndGoToBooking(page);

    await eventBookingPage.increaseTicketCount(2);
    await eventBookingPage.completeStandardBooking({
        name: 'Siva Kalyan',
        email: getUserEmail(),
        phone: '9876543210',
    });

    await eventBookingPage.openMyBookings();
    await expect(page).toHaveURL(/\/bookings(?:[?#].*)?$/);
    await eventBookingPage.openFirstBookingDetails();
    await expect(eventBookingPage.bookingInformation()).toBeVisible();

    const bookingRef = await eventBookingPage.bookingReferenceText();
    const eventTitle = (await eventBookingPage.bookingEventTitle().innerText()).trim();
    expect(bookingRef[0]).toBe(eventTitle[0]);

    await eventBookingPage.checkRefundEligibility();
    await expect(eventBookingPage.refundSpinner()).toBeVisible();
    await expect(eventBookingPage.refundSpinner()).toBeHidden({ timeout: 6_000 });

    const refundResult = eventBookingPage.refundResult();
    await expect(refundResult).toBeVisible();
    await expect(refundResult).toContainText('Not eligible for refund');
    await expect(refundResult).toContainText('Group bookings (3 tickets) are non-refundable');
});

test('Verify manage bookings Page', async ({ page }) => {
    test.setTimeout(120_000);
    const eventHubPage = new EventHubPage(page);
    await eventHubPage.openManageBooking();
    await page.locator('select').selectOption({ label: 'Confirmed' });
    const confirmedRecords = await eventHubPage.getConfirmedRecords();
    console.log("Total Confirmed Records:", confirmedRecords.length);
    expect(confirmedRecords.length).toBe(9);
    await eventHubPage.clickViewBooking();
    await eventHubPage.validateBookingStatus();
});