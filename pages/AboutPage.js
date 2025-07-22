// pages/AboutPage.js
class AboutPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
      this.page = page;
      this.url = 'https://metro.co.uk/about/';
    }
  
    async navigate() {
      await this.page.goto(this.url,{ waitUntil: 'networkidle' , waitUntil:'load'});
    }
  }
  
  module.exports = { AboutPage };
  