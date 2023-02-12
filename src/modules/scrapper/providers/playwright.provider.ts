import { BrowserType, chromium, ChromiumBrowser } from 'playwright';
import { ScrapperProvider } from '@/modules/scrapper/providers/interfaces/scrapper.provider';

export class PlaywrightProvider implements ScrapperProvider {
  core: BrowserType<ChromiumBrowser>;

  constructor(
    private readonly page,
    private readonly url,
    private readonly timeout: number,
    private readonly urlRegex: RegExp,
  ) {
    this.core = chromium;
  }

  async scrape(url: string): Promise<any> {
    await this.page.goto(this.url, { waitUntil: 'networkidle' });

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
      await this.page.waitForTimeout(this.timeout);

      const pdf = await this.page.pdf();

      pdfs.push(pdf);
    }

    return pdfs;
  }
}
