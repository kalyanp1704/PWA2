# AI Copilot Instructions for Playwright Test Automation

## Project Overview
This is a **Playwright-based test automation framework** with support for both standard Playwright tests and BDD (Behavior-Driven Development) using Cucumber. The project automates testing for e-commerce platforms, casino signup flows, and web APIs.

## Architecture

### Core Testing Patterns
- **Standard Playwright Tests**: Located in `tests/` directory (`.spec.js` files)
- **BDD/Cucumber Tests**: Feature files in `feature/` with step definitions in `feature/step_definations/`
- **Page Objects**: Reusable UI interaction classes in `pageObjects/`

### Key Components
1. **Page Objects** (`pageObjects/CasinoFlow.js`): Classes encapsulating page interactions with locators and methods
   - Constructor stores page reference and all locators as properties
   - Methods for user workflows (login, form filling, selections)
   - Use Playwright's accessibility selectors: `getByRole()`, `getByTestId()`, `getByText()`

2. **Test Specs** (`tests/*.spec.js`): Test files importing page objects
   - Use `test()` from `@playwright/test`
   - Create browser context with viewport: `{ width: 1920, height: 1080 }`
   - Instantiate page objects and call workflow methods

3. **BDD Layer** (`feature/step_definations/`): Cucumber step definitions
   - Use `Given`, `When`, `Then` from `@cucumber/cucumber`
   - Each step returns 'pending' if not implemented

## Configuration (`playwright.config.js`)

**Critical Settings**:
- `testDir: './tests'` - scan this directory for specs
- `timeout: 90 * 1000` - test timeout (90 seconds)
- `expect.timeout: 5 * 1000` - assertion timeout
- `headless: false` - run in headed mode (visual debugging)
- `slowMo: 1000` - 1 second delay between actions
- `screenshot: 'on'` - capture screenshots always
- `trace: 'retain-on-failure'` - record traces only for failed tests
- `navigationTimeout: 90 * 1000` - page navigation timeout

Reports are generated in `playwright-report/` (HTML format).

## Developer Workflows

### Running Tests
```bash
# No npm scripts defined - use Playwright directly
npx playwright test              # Run all tests in tests/
npx playwright test --headed     # Override config, run in headed mode
npx playwright test tests/WebCasino.spec.js  # Run specific test
```

### Debugging
- Tests run with `headless: false` and `slowMo: 1000` to allow inspection
- Screenshots auto-saved to project root (e.g., `screenshot.png`, `PartialScreenshot.png`)
- Traces available in `test-results/` and `playwright-report/trace/`

## Testing Patterns & Conventions

### Locator Priority (from codebase)
Use accessibility-first selectors in this order:
1. `getByRole()` - preferred for buttons, links, textboxes: `getByRole('button', { name: 'Submit' })`
2. `getByTestId()` - for custom attributes: `getByTestId('sel-geoloc-scenario')`
3. `getByText()` - for text content: `getByText('Create your Fanatics account')`
4. `locator()` - XPath/CSS as fallback: `locator("[data-testid='wallet-iframe']")`

### Page Object Methods Pattern
```javascript
// Constructor: Store page and define all locators
constructor(page) {
  this.page = page;
  this.loginBtn = page.getByRole('button', { name: 'Log in' });
  this.emailInput = page.getByRole('textbox', { name: 'Email address' });
}

// Methods: Implement workflows, not single actions
async login(email, password) {
  await this.emailInput.fill(email);
  await this.loginBtn.click();
}
```

### API Testing Pattern (from `WebAPI.spec.js`)
- Use `request` fixture from Playwright
- Store auth tokens in `localStorage` via `page.addInitScript()`
- Combine API responses with UI verification

### Common Interactions
- **Form filling**: Use `fill()` for text, `pressSequentially()` for sensitive data
- **Selection**: Use `selectOption()` for dropdowns
- **Waits**: Use `waitFor({ state: 'visible/hidden', timeout: 10000 })`
- **Dialog handling**: Use `page.once('dialog', async dialog => { await dialog.dismiss(); })`

## Dependencies
- `@playwright/test: ^1.53.2` - Main testing framework
- `@cucumber/cucumber: ^12.5.0` - BDD support
- `@types/node: ^24.0.10` - TypeScript types

## Key Files to Reference
- [playwright.config.js](playwright.config.js) - Test configuration and timeouts
- [pageObjects/CasinoFlow.js](pageObjects/CasinoFlow.js) - Example page object pattern
- [tests/WebCasino.spec.js](tests/WebCasino.spec.js) - Example standard test with page objects
- [tests/WebAPI.spec.js](tests/WebAPI.spec.js) - Example API + UI test pattern
- [feature/Ecommerce.feature](feature/Ecommerce.feature) - Example BDD feature file

## Guidelines for AI Agents

1. **Always use page objects** for new tests - don't inline locators in test files
2. **Follow accessibility locators** - they are more resilient than XPath
3. **Wait strategically** - use `waitFor()` before critical actions, respect 90s test timeout
4. **Handle async flows** - use `async/await`, not callbacks
5. **Reference existing tests** before creating new ones - patterns are documented in `WebCasino.spec.js`, `PracticeLetsshop.spec.js`, `WebAPI.spec.js`
6. **Test isolation** - each test should be independent (no shared state)
7. **Frame handling** - detect iframes with `locator('[data-testid="iframe-name"]')` before interacting
