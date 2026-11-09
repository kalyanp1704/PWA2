const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const AUTH_FILE = path.join(__dirname, '..', '.auth', 'eventhub.json');

test('authenticate once for EventHub tests', async ({ page }) => {
    const email = process.env.EVENTHUB_EMAIL;
    const password = process.env.EVENTHUB_PASSWORD;
    if (!email || !password) {
        throw new Error('Set EVENTHUB_EMAIL and EVENTHUB_PASSWORD before running the EventHub tests.');
    }

    await page.goto(BASE_URL);
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Browse Events →', { exact: true })).toBeVisible();

    fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
    await page.context().storageState({ path: AUTH_FILE });
});
