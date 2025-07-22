// playwright.config.js
const config = {
  testDir: './test',       
  timeout: 30 * 1000,
  retries: 0,
  use: {
    browserName: 'chromium',
    viewport: { width: 375, height: 812 },
  },
  reporter: [['html', { open: 'never' }]],
};

module.exports = config;
