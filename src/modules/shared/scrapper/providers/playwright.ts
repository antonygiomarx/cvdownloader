import { BrowserType, ChromiumBrowser, chromium } from 'playwright';

export class PlaywrightProvider {
  core: BrowserType<ChromiumBrowser>;

  constructor() {
    this.core = chromium;
  }
  async launch() {
    const browser = await this.core.launch({
      headless: true,
    });
    return browser;
  }
}
