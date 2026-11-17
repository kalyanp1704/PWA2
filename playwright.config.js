const { defineConfig } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

const eventHubAuthFile = path.join(__dirname, '.auth', 'eventhub.json');

module.exports = defineConfig({
  testDir: '.',
  projects: [
    {
      name: 'eventhub-auth-setup',
      testMatch: '**/eventhub-auth.setup.js',
      use: {
        launchOptions: {
          slowMo: 300,
        },
      },
    },
    {
      name: 'eventhub',
      testMatch: '**/eventhub_assignment.spec.js',
      dependencies: ['eventhub-auth-setup'],
      use: {
        storageState: eventHubAuthFile,
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
        '**/eventhub-auth.setup.js',
      ],
    },
  ],
});
