const { test, expect } = require('@playwright/test');

const eventTitle = `Test${Date.now()}-Sk`;

test.use({
    launchOptions : ({ slowMo : 2000 }),

})
async function login(page) {
    await page.goto('https://eventhub.rahulshettyacademy.com');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).pressSequentially('posakalyan9@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).pressSequentially('Kalyan1704@');
    await page.getByRole('button', { name: 'Sign In' }).click();
    const text = await page.getByText('Browse Events →').textContent();
    console.log(text);

    await page.getByText('Admin', { exact: true }).nth(0).click();
    await page.getByText('Manage Events', { exact: true }).nth(0).click();
    
    const BROWSE_EVENT = page.getByText('+ New Event');
    await expect(BROWSE_EVENT).toBeVisible();
    console.log(await BROWSE_EVENT.innerText());

    console.log(eventTitle);
    await page.locator('#event-title-input').click();
    await page.locator('#event-title-input').fill(eventTitle);
    await page.getByPlaceholder('Describe the event…').click();
    await page.getByPlaceholder('Describe the event…').fill('This is SK Event Kitchen clubs.');
    await page.locator('#city').click();
    await page.locator('#city').fill('Hyderabad');
    await page.locator('#venue').click();
    await page.locator('#venue').fill('AMB Mall - Sarath Capital City');

    const eventDate = page.getByLabel('Event Date & Time');
    await eventDate.fill('2027-12-31T12:00');
    await expect(eventDate).toHaveValue('2027-12-31T12:00');

    await page.getByLabel('Price ($)').click();
    await page.getByLabel('Price ($)').fill('1000');
    await page.locator('#total-seats').click();
    await page.locator('#total-seats').type('555');
    await page.getByTestId('add-event-btn').click();
    
    const EVENT_CREATED = page.getByText('✓Event created!');
    await expect(EVENT_CREATED).toBeVisible();
    console.log(await EVENT_CREATED.innerText());

    await page.locator('#nav-events').click();
    const allEventCards = page.getByTestId('event-card');
    await expect(allEventCards.first()).toBeVisible();

    const createdEventCard = allEventCards.filter({ hasText: eventTitle });
    await expect(createdEventCard).toBeVisible({ timeout: 5_000 });

    const seatCountText = await createdEventCard.getByText(/seat/i).innerText();
    const seatCountMatch = seatCountText.match(/[\d,]+/);
    expect(seatCountMatch, `Could not parse a seat count from "${seatCountText}"`).not.toBeNull();
    const seatsBeforeBooking = Number.parseInt(seatCountMatch[0].replace(/,/g, ''), 10);
    console.log(`Seats before booking: ${seatsBeforeBooking}`);

    // Start booking
    await createdEventCard.getByTestId('book-now-btn').click();

    // Fill booking form
    await expect(page.locator('#ticket-count')).toHaveText('1');
























    
}

test('Verify home page', async ({ page }) => {
    test.setTimeout(60_000);

    await page.setViewportSize({width : 1980, height: 1080 });
    await login(page);
});