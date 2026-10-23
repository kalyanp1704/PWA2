const { test } = require('@playwright/test');
const { CasinoFlow } = require('../pageObjects/CasinoFlow');

test.only('Casino Signup flow', async ({ browser }) => {
  const email = process.env.FANATICS_TEST_EMAIL;
  const password = process.env.FANATICS_TEST_PASSWORD;
  if (!email || !password) {
    throw new Error('Set FANATICS_TEST_EMAIL and FANATICS_TEST_PASSWORD to run this test.');
  }

  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  const casino = new CasinoFlow(page);

  await casino.openSite('https://web.test-1.fanatics.bet/');
  await casino.setupDevToolsAndGeo();
  await casino.login(email, password);

  if (await casino.isCreateAccountVisible()) {
    await casino.selectRandomGame();
    await casino.fillPersonalDetails();
    await casino.verifyPhone();
    await casino.fillWalletDetails();
  } else if (await casino.isExistingAccountVisible()) {
    await casino.fillPersonalDetails();
    await casino.verifyPhone();
    await casino.fillWalletDetails();
  } else {
    console.log('Neither Create Account nor Existing Account option is visible!');
  }
});
module.exports = { CasinoFlow };

