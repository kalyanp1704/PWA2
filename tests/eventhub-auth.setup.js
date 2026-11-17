const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const PROJECT_DIR = path.join(__dirname, '..');
const AUTH_FILE = path.join(PROJECT_DIR, '.auth', 'eventhub.json');

function getCredentials() {
    const email = process.env.EVENTHUB_EMAIL;
    const password = process.env.EVENTHUB_PASSWORD;
    const missing = [
        !email && 'EVENTHUB_EMAIL',
        !password && 'EVENTHUB_PASSWORD',
    ].filter(Boolean);

    if (missing.length > 0) {
        throw new Error(
            `Missing ${missing.join(' and ')}. Set them in your environment or in PWA2/.env (see .env.example).`
        );
    }

    return { email, password };
}

test('authenticate once for EventHub tests', async ({ page }) => {
    const { email, password } = getCredentials();

    await page.goto(BASE_URL);
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Browse Events →', { exact: true })).toBeVisible();

    fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
    await page.context().storageState({ path: AUTH_FILE });
});
