/**
 * Extracts GA request parameters from a request URL.
 * @param {string} url
 * @returns {{ requestUrl: string, contentType: string, platform: string, pageUrl: string }}
 */
function extractGAParams(url) {
    const urlParams = new URL(url).searchParams;
    return {
      requestUrl: url,
      contentType: urlParams.get('ep.content_type'),
      platform: urlParams.get('ep.rendered_platform'),
      pageUrl: urlParams.get('ep.page_url'),
    };
  }
  
  /**
   * Waits for a Google Analytics request to appear.
   * @param {import('@playwright/test').Page} page
   * @returns {Promise<Object>} Parameters extracted from GA request
   */
  async function waitForGARequest(page) {
    return new Promise((resolve) => {
      page.on('request', (request) => {
        if (request.url().includes('google-analytics.com/g/collect')) {
          const params = extractGAParams(request.url());
          resolve(params);
        }
      });
    });
  }
  
  module.exports = { waitForGARequest, extractGAParams };
  