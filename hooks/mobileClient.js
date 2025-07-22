// hooks/mobileClient.js
const { chromium, devices } = require('@playwright/test');
const { AboutPage } = require('../pages/AboutPage');

let browser, context, page, aboutPage;

async function setupMobileClient() {
  browser = await chromium.launch({ headless: false, slowMo: 100 });
  context = await browser.newContext({
    ...devices['Pixel 7'],
    viewport: { width: 412, height: 915 }  // Pixel 7 resolution
  });  page = await context.newPage();
  aboutPage = new AboutPage(page);

  // Expose globals for tests
  global.browser = browser;
  global.context = context;
  global.page = page;
  global.aboutPage = aboutPage;
}

async function teardownMobileClient() {
  if (browser) {
    await browser.close();
  }
}

module.exports = { setupMobileClient, teardownMobileClient };
