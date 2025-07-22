const { test, expect } = require('@playwright/test');
const { waitForGARequest } = require('../utils/networkUtils');
const { setupMobileClient, teardownMobileClient } = require('../hooks/mobileClient');
const fs = require('fs');
const path = require('path')

test.beforeAll(async () => {
  await setupMobileClient();
});

test.afterAll(async () => {
  await teardownMobileClient();
});


const screenshotDir = path.join(__dirname, '../screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir);
}

test.afterEach(async ({}, testInfo) => {
  const screenshotPath = path.join(__dirname, `../screenshots/${testInfo.title}.png`);
  if (testInfo.status !== testInfo.expectedStatus) {
    await global.page.screenshot({ path: screenshotPath, fullPage: true });
    await testInfo.attach('failure-screenshot', {
      path: screenshotPath,
      contentType: 'image/png',
    });
  }
});

test.describe('Step 1: Navigate to About Page (Mobile)', () => {
  test('should navigate to https://metro.co.uk/about/ on mobile Chrome', async () => {
    await global.aboutPage.navigate();
    expect(await global.page.url()).toBe('https://metro.co.uk/about/');
  });
});
test.describe('Step 2: Inspect Network Requests for google-analytics', () => {
  test('should detect a request to https://www.google-analytics.com/g/collect', async () => {
    const gaPromise = waitForGARequest(global.page);
    await global.aboutPage.navigate();
    const gaData = await gaPromise;

    // Assertion for GA request
    expect(gaData.requestUrl).toContain('google-analytics.com/g/collect');
    await global.page.screenshot({ path: path.join(screenshotDir, 'about-page.png'), fullPage: true });

  });
});

test.describe('Step 3: Verify GA Request Parameters', () => {
  test('should have correct GA parameters', async () => {
    const gaPromise = waitForGARequest(global.page);
    await global.aboutPage.navigate();
    const gaData = await gaPromise;

    // Assertions for GA parameters
    expect(gaData.contentType, 'ep.content_type should be "page"').toBe('page');
    expect(gaData.platform, 'ep.rendered_platform should be "mobile"').toBe('mobile');
    expect(gaData.pageUrl, `ep.page_url should be https://metro.co.uk/about/`).toBe('https://metro.co.uk/about/');
  });
});
