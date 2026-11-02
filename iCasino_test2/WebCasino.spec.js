const { test, expect } = require('@playwright/test');

test('Fanatics Casino homepage is available', async ({ page }) => {
  await page.goto('https://web.test-1.fanatics.bet/');
  await expect(page.getByRole('link', { name: 'Log In' })).toBeVisible({
    timeout: 15_000,
  });
});
