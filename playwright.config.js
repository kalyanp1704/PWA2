const { defineConfig } = require('@playwright/test');
const path = require('path');

const eventHubAuthFile = path.join(__dirname, '.auth', 'eventhub.json');

module.exports = defineConfig({
  testDir: '.',
  projects: [
    {
      name: 'eventhub-auth-setup',
      testMatch: '**/eventhub-auth.setup.js',
    },
    {
      name: 'eventhub',
      testMatch: '**/eventhub_assignment.spec.js',
      dependencies: ['eventhub-auth-setup'],
      use: {
        storageState: eventHubAuthFile,
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
