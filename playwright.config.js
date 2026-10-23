// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { config } from 'process';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  timeout: 90 * 1000, 
  expect: {
    timeout: 5 * 1000,
  },
  reporter: 'html',

  use: {
    browserName: "chromium",
    headless : false, 
    actionTimeout: 0,
    navigationTimeout: 90 * 1000,
    screenshot : 'on',
    trace : 'retain-on-failure', // if the trace is 'retain-on-failure' - only for failure Cases
    // trace : 'On', // if the trace is 'on' - all cases report will there(pass & fail)
    
    launchOptions: 
    {
      slowMo: 1000, //1 sec
    }  
     
  }
  
});
   


  // metadata: {
  //   project: 'Flipkart-Amazon Tests',
  //   owner: 'Siva Kalyan',
  //   environment: 'QA'
  // }



  /* Configure projects for major browsers */
  // projects: [
  //   {
  //     name: 'chromium',
  //     use: { ...devices['Desktop Chrome'] },
  //   },

  //   {
  //     name: 'firefox',
  //     use: { ...devices['Desktop Firefox'] },
  //   },

  //   {
  //     name: 'webkit',
  //     use: { ...devices['Desktop Safari'] },
  //   },

  //   /* Test against mobile viewports. */
  //   // {
  //   //   name: 'Mobile Chrome',
  //   //   use: { ...devices['Pixel 5'] },
  //   // },
  //   // {
  //   //   name: 'Mobile Safari',
  //   //   use: { ...devices['iPhone 12'] },
  //   // },

  //   /* Test against branded browsers. */
  //   // {
  //   //   name: 'Microsoft Edge',
  //   //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
  //   // },
  //   // {
  //   //   name: 'Google Chrome',
  //   //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
  //   // },
  // ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },

