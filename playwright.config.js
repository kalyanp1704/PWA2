const { defineConfig } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

module.exports = defineConfig({
  testDir: './tests',
  retries: 1,
  reporter: [
    ['list'],
    ['allure-playwright'],
  ],

  use: {
    browserName: 'chromium',
  },

  projects: [
    {
      name: 'eventhub',
      testMatch: '**/eventhub_assignment.spec.js',
      use: {
        launchOptions: {
          slowMo: 300,
        },
      },
    },
    {
      name: 'default',
      testMatch: '**/*.spec.js',
      testIgnore: [
        '**/eventhub_assignment.spec.js',
      ],
    },
  ],
});
