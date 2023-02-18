import { BrowserType, chromium, ChromiumBrowser, Page } from 'playwright';
import { ScrapperProvider } from '@/modules/scrapper/providers/interfaces/scrapper.provider';
import { Logger } from '@nestjs/common';

export class PlaywrightProvider implements ScrapperProvider {
  core: BrowserType<ChromiumBrowser>;
  page: Page;
  private readonly logger = new Logger(PlaywrightProvider.name);

  constructor(
    private readonly url: string,
    private readonly timeout: number,
    private readonly urlRegex: RegExp,
  ) {
    this.core = chromium;
  }

  async scrape(): Promise<any> {
    try {
      const browser = await this.core.launch({
        headless: false,
      });

      if (!this.page) this.page = await browser.newPage();

      await this.page.goto(this.url);

      await this.page.waitForTimeout(this.timeout);

      const elements = await this.page.$$('.pdf-viewer__page');

      if (!elements) throw new Error('No elements found!');

      const items = [];

      for (const element of elements) {
        const el = await element.getAttribute('style');

        if (!el) continue;

        const url = el.match(this.urlRegex);
        items.push(url);
      }

      const urls = items.filter((item) => item).map((item) => new URL(item));

      const pdfs = [] as Buffer[];

      for (const url of urls) {
        await this.page.goto(url.href);
        await this.page.waitForTimeout(this.timeout / 2);

        const { height, width } = await this.page.$eval('img', (el) => {
          const width = el.getAttribute('width') || 510;
          const height = el.getAttribute('height') || 720;

          return {
            width,
            height,
          };
        });

        const pdf = await this.page.pdf({
          height,
          width,
        });

        pdfs.push(pdf);
      }

      await browser.close();

      return pdfs;
    } catch (e) {
      this.logger.error(e);
    }
  }
}
