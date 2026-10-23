// ============================================================
// FILE: fanatics_login_explained.spec.js
// PURPOSE: Automates the Fanatics Casino login flow from site
//          load → DevTools geo setup → Login → Dashboard verify
// FRAMEWORK: Playwright Test (Node.js)
// ============================================================


// ─────────────────────────────────────────────────────────────
// LINE 1: Import Playwright Test utilities
// ─────────────────────────────────────────────────────────────
// 'test'   → function used to define a test case block
// 'expect' → function used to write assertions (verify conditions)
// Both are imported from the @playwright/test package
const { test, expect } = require('@playwright/test');


// ─────────────────────────────────────────────────────────────
// LINE 2: Define the test case
// ─────────────────────────────────────────────────────────────
// test('description', async ({ page }) => { ... })
//   - First argument  : A human-readable name for the test
//   - Second argument : An async callback function
//   - { page }        : Playwright auto-creates a fresh browser page
//                       and injects it here. No manual browser.launch() needed.
test('Fanatics Casino - Login Flow to Dashboard', async ({ page }) => {
  const email = process.env.FANATICS_TEST_EMAIL;
  const password = process.env.FANATICS_TEST_PASSWORD;
  if (!email || !password) {
    throw new Error('Set FANATICS_TEST_EMAIL and FANATICS_TEST_PASSWORD to run this test.');
  }


  // ===========================================================
  // STEP 1: Navigate to the Fanatics Casino website
  // ===========================================================

  // page.goto(url)
  //   → Instructs Playwright to open the given URL in the browser.
  //   → It waits until the page's "load" event fires before continuing.
  //   → Similar to typing the URL in a browser address bar and pressing Enter.
  await page.goto('https://web.test-1.fanatics.bet');

  // page.waitForSelector('text=Log In', { timeout: 15000 })
  //   → Waits until an element containing the text "Log In" appears on screen.
  //   → timeout: 15000 means wait up to 15 seconds before failing.
  //   → This ensures the page is fully rendered before we take any action.
  //   → Without this, we might try to click before the button even exists.
  await page.waitForSelector('text=Log In', { timeout: 15000 });

  // console.log()
  //   → Prints a message to the terminal/console while the test runs.
  //   → Used here for progress tracking / debugging visibility.
  console.log('✅ Step 1: Site loaded successfully');


  // ===========================================================
  // STEP 2: Open the DevTools / Debug Menu (Settings icon)
  // ===========================================================

  // page.getByRole('link', { name: 'devtools' })
  //   → Finds an <a> (link) element whose accessible name is "devtools".
  //   → getByRole() is the recommended Playwright locator — it finds elements
  //     the way a screen reader or browser sees them (by ARIA role + name).
  //   → This targets the gear/settings icon in the top-left corner.
  //
  // .click()
  //   → Simulates a mouse click on the found element.
  //   → Playwright auto-scrolls to the element and waits for it to be clickable.
  await page.getByRole('link', { name: 'devtools' }).click();

  // page.waitForURL('**/devtools', { timeout: 10000 })
  //   → Waits until the browser's current URL matches the pattern "**/devtools".
  //   → The ** wildcard matches any prefix (e.g., https://web.test-1.fanatics.bet/devtools).
  //   → This confirms the DevTools page has loaded before we proceed.
  await page.waitForURL('**/devtools', { timeout: 10000 });

  console.log('✅ Step 2: DevTools / Debug Menu opened');


  // ===========================================================
  // STEP 3: Read ALL Geolocation Scenario dropdown options and print them
  // ===========================================================

  // page.locator('select').nth(1)
  //   → page.locator('select') finds ALL <select> (dropdown) elements on the page.
  //   → .nth(1) selects the SECOND one (index starts at 0).
  //   → The DevTools page has two dropdowns:
  //       Index 0 → Environment Scenario (DEV / TEST / CERT etc.)
  //       Index 1 → Geolocation Scenario (SUCCESS_WV / SUCCESS_NJ etc.)
  //   → We target index 1 to get the Geolocation dropdown.
  const geoScenarioDropdown = page.locator('select').nth(1);

  // .locator('option').allTextContents()
  //   → Finds all <option> elements inside the dropdown.
  //   → .allTextContents() returns an array of strings — one per option's text.
  //   → Example result: ["NONE", "SUCCESS_AZ", "SUCCESS_WV", ...]
  const allOptions = await geoScenarioDropdown.locator('option').allTextContents();

  // Print the dropdown label to console
  console.log('📋 Step 3: Geolocation Scenario Dropdown — All Options:');

  // forEach() loops through each option and prints it with its index number.
  // (opt, i) → opt = option text, i = position in the array (0-based)
  // We use i + 1 to display a 1-based count for readability.
  allOptions.forEach((opt, i) => console.log(`   ${i + 1}. ${opt}`));


  // ===========================================================
  // STEP 4: Select SUCCESS_WV in the Geolocation Scenario dropdown
  // ===========================================================

  // .selectOption('SUCCESS_WV')
  //   → Sets the dropdown's selected value to the option whose value/text is "SUCCESS_WV".
  //   → This simulates a user clicking the dropdown and choosing SUCCESS_WV.
  //   → Playwright fires the necessary "change" events so the app reacts to the selection.
  //   → SUCCESS_WV mocks geolocation as West Virginia — required for WV-licensed games to load.
  await geoScenarioDropdown.selectOption('SUCCESS_WV');

  // .inputValue()
  //   → Reads the currently selected value of the dropdown.
  //   → Used to confirm our selectOption() call actually worked.
  const selectedValue = await geoScenarioDropdown.inputValue();

  // expect(selectedValue).toBe('SUCCESS_WV')
  //   → ASSERTION: Verifies the dropdown is now showing 'SUCCESS_WV'.
  //   → If the value is anything else, the test fails immediately with a clear error.
  //   → This is a "guard" — catching issues early rather than failing silently later.
  expect(selectedValue).toBe('SUCCESS_WV');

  console.log(`✅ Step 4: Geolocation Scenario set to → ${selectedValue}`);


  // ===========================================================
  // STEP 5: Click the Log In button
  // ===========================================================

  // page.getByRole('link', { name: 'Log In' })
  //   → Finds the "Log In" link element by its ARIA role (link) and accessible name.
  //   → In the HTML this is rendered as <a href="/login">Log In</a>
  //
  // .click()
  //   → Clicks the Log In link, which navigates to the /login page.
  await page.getByRole('link', { name: 'Log In' }).click();

  // page.waitForURL('**/login', { timeout: 10000 })
  //   → Waits until the URL changes to something ending in /login.
  //   → Confirms the login modal/page has been triggered before typing the email.
  await page.waitForURL('**/login', { timeout: 10000 });

  console.log('✅ Step 5: Log In clicked — login page opened');


  // ===========================================================
  // STEP 6: Enter the email address
  // ===========================================================

  // page.getByRole('textbox', { name: 'Email address' })
  //   → Finds an <input type="text"> or <input type="email"> element
  //     whose label/placeholder/aria-label matches "Email address".
  //   → More reliable than CSS selectors because it's tied to accessibility semantics,
  //     not to internal class names that might change with app updates.
  const emailInput = page.getByRole('textbox', { name: 'Email address' });

  // .waitFor({ timeout: 10000 })
  //   → Waits for this specific element to exist and be visible in the DOM.
  //   → Necessary because the login form may render with a slight delay
  //     after navigating to /login.
  await emailInput.waitFor({ timeout: 10000 });

  // .clear()
  //   → Clears any pre-filled text in the email field.
  //   → Important because from a previous session, the field might already
  //     contain an old email address (e.g., fc2 from a prior test run).
  await emailInput.clear();

  //   → Types the given email address into the input field programmatically.
  //   → .fill() is preferred over .type() because:
  //       • It clears the field first automatically
  //       • It's faster (doesn't simulate individual keystrokes)
  //       • It works reliably even on fields with validation logic
  await emailInput.fill(email);

  console.log('✅ Step 6: Email entered');


  // ===========================================================
  // STEP 7: Click the Continue button
  // ===========================================================

  // page.getByRole('button', { name: 'Continue' })
  //   → Finds the <button> element with the text "Continue".
  //   → After entering the email, the app validates it and enables this button.
  //
  // .click()
  //   → Submits the email to check if an account exists with that address.
  //   → If the email is found, the app transitions to the password entry screen.
  await page.getByRole('button', { name: 'Continue' }).click();

  console.log('✅ Step 7: Continue clicked');

  // page.waitForSelector('input[type="password"]', { timeout: 15000 })
  //   → Waits for a password input field to appear in the DOM.
  //   → This confirms the app recognized the email and is now asking for the password.
  //   → Uses a CSS selector: input[type="password"] matches <input type="password" ...>
  //   → We wait up to 15 seconds because the server call to look up the email may take time.
  await page.waitForSelector('input[type="password"]', { timeout: 15000 });

  console.log('✅ Password screen appeared');


  // ===========================================================
  // STEP 8: Enter the password
  // ===========================================================

  // page.getByRole('textbox', { name: 'Password' })
  //   → Finds the password input field by its ARIA role and accessible label.
  //   → Note: Even though it's type="password" in HTML, Playwright's getByRole
  //     treats it as a 'textbox' with accessible name matching the field's label.
  //
  //   → Fills in the password value into the field.
  //   → Playwright does NOT log the actual password value in test reports (security).
  await page.getByRole('textbox', { name: 'Password' }).fill(password);

  console.log('✅ Step 8: Password entered');


  // ===========================================================
  // STEP 9: Click the Log in button to submit credentials
  // ===========================================================

  // page.getByRole('button', { name: 'Log in' })
  //   → Finds the submit button on the password screen.
  //   → Note the subtle difference:
  //       • Step 5 used 'Log In' (LINK on homepage, capital I)
  //       • Step 9 uses 'Log in' (BUTTON on login form, lowercase i)
  //     These are different elements with different ARIA roles — be exact!
  //
  // .click()
  //   → Submits the login credentials to the Fanatics authentication server.
  //   → Playwright waits for any triggered navigation or network requests to settle.
  await page.getByRole('button', { name: 'Log in' }).click();

  console.log('✅ Step 9: Log in button clicked — authenticating...');


  // ===========================================================
  // STEP 10: Wait for the Dashboard to become visible
  // ===========================================================

  // page.waitForURL(url => !url.toString().includes('/login'), { timeout: 20000 })
  //   → Waits until the browser URL changes AWAY from /login.
  //   → Takes a predicate (callback) function: receives the URL object as argument.
  //   → url.toString() converts the URL object to a plain string.
  //   → .includes('/login') checks if the string contains '/login'.
  //   → The ! (NOT operator) inverts it: wait until URL does NOT contain '/login'.
  //   → This is more flexible than hardcoding '**/casino' because the app may redirect
  //     to different paths depending on the user's account state or A/B testing.
  //   → timeout: 20000 gives 20 seconds for authentication + redirect to complete.
  await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 20000 });

  // page.waitForSelector('text=Search for games', { timeout: 20000 })
  //   → Waits until the "Search for games" placeholder text is visible on screen.
  //   → This is the casino lobby search bar — a reliable landmark that confirms
  //     the dashboard content has fully rendered (not just the URL changed).
  //   → We choose this over other elements because it appears early in the DOM
  //     and is always present regardless of the user's account state.
  await page.waitForSelector('text=Search for games', { timeout: 20000 });

  console.log('✅ Step 10: Dashboard is visible — Login successful!');

  // page.url()
  //   → Returns the current page URL as a string at this moment.
  //   → Logged here to show exactly which URL was loaded after login.
  console.log(`📍 Current URL: ${page.url()}`);


  // ===========================================================
  // STEP 11: Final Assertions — Verify all key dashboard elements
  // ===========================================================

  // expect(page).toHaveURL(/\/(casino|$)/, { timeout: 5000 })
  //   → Asserts the current URL matches the regex /\/(casino|$)/
  //   → Regex breakdown:
  //       \/       = literal forward slash /
  //       (casino|$) = either the word "casino" OR end of string ($)
  //   → Matches: https://.../casino  OR  https://.../
  //   → Does NOT match: https://.../login  (would fail = correct behavior)
  await expect(page).toHaveURL(/\/(casino|$)/, { timeout: 5000 });

  // expect(page.getByRole('link', { name: 'account' })).toBeVisible()
  //   → Asserts the user's account icon (profile link) is visible in the header.
  //   → This element ONLY appears when a user is authenticated/logged in.
  //   → If this is missing, the user is still logged out — test correctly fails.
  //   → .toBeVisible() checks both: element exists AND is not hidden (display:none / visibility:hidden).
  await expect(page.getByRole('link', { name: 'account' })).toBeVisible({ timeout: 5000 });

  // expect(page.locator('a[href="/deposit"]')).toBeVisible()
  //   → Asserts the Deposit / Balance button is visible in the header.
  //   → page.locator('a[href="/deposit"]') uses a CSS attribute selector —
  //     finds any <a> tag that has href="/deposit" attribute.
  //   → The deposit button shows the user's account balance (e.g., "FanCash: $75.00").
  //   → Only rendered for authenticated users — confirms full logged-in dashboard state.
  await expect(page.locator('a[href="/deposit"]')).toBeVisible({ timeout: 5000 });

  // expect(page.getByRole('textbox', { name: 'Search for games' })).toBeVisible()
  //   → Asserts the game search input box is visible and interactive.
  //   → This confirms the casino lobby has fully loaded its UI components,
  //     not just the page shell/header.
  await expect(page.getByRole('textbox', { name: 'Search for games' })).toBeVisible({ timeout: 5000 });

  console.log('✅ All assertions passed — Dashboard fully loaded and verified!');

}); // ← Closing brace of test() block — test ends here