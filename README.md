# PWA2 Playwright Tests

## Project structure

- `tests/` - Playwright test specs; EventHub login runs in the spec's `beforeEach`
- `pageObjects/` - Page-object models grouped by application
- `Utils/` - Shared test utilities
- `Git_github_Q&A/`, `Interview_Q&A/`, `Playwright_Interview_Q&A/` - Learning references
- `.env.example` - Template for local EventHub credentials
- `playwright.config.js` - Playwright projects and test configuration

Playwright reports, test results, and `.env` are generated or local-only and are ignored by Git.

## Setup

Use Node.js 20.12 or newer.

```cmd
npm ci
copy .env.example .env
```

Edit `.env` with valid EventHub login credentials before running the EventHub tests.

## Run tests

```cmd
npm test
npm run test:eventhub:headed
```

The EventHub project uses a 300 ms action delay. Each EventHub test signs in directly using the credentials from `.env`.

## Generate and open the Allure report

```cmd
npm run test:eventhub:headed
npm run report:allure
npm run allure:open
```
