# PWA2 Playwright Tests

## Project structure

- `tests/` - Playwright test specs and the EventHub authentication setup
- `pageObjects/` - Page-object models grouped by application
- `Utils/` - Shared test utilities
- `Git_github_Q&A/`, `Interview_Q&A/`, `Playwright_Interview_Q&A/` - Learning references
- `.env.example` - Template for local EventHub credentials
- `playwright.config.js` - Playwright projects and test configuration

Playwright reports, test results, authentication state, and `.env` are generated or local-only and are ignored by Git.

## Setup

```cmd
npm ci
copy .env.example .env
```

Edit `.env` with valid EventHub login credentials before running the EventHub tests.

## Run tests

```cmd
npx playwright test
npx playwright test tests/eventhub_assignment.spec.js --headed
```

The EventHub projects use a 300 ms action delay.

## Generate and open the Allure report

```cmd
npx playwright test tests/eventhub_assignment.spec.js --headed --reporter=line,allure-playwright
npm run report:allure
npx allure open ./allure-report
```
