import { Page } from 'playwright';
import { BaseStrategy } from './base.strategy';

export class ResumeioStrategy implements BaseStrategy {
  constructor(
    readonly urlRegex: RegExp,
    private readonly page: Page,
    private readonly url: string,
    private readonly timeout: number,
  ) {}

  async scrape(): Promise<Buffer[]> {
    await this.page.goto(this.url);

    await this.page.waitForSelector('.pdf-viewer__page');

    await this.page.waitForTimeout(this.timeout);

    const elements = await this.page.$$('.pdf-viewer__page');

    const items = [];

    for (const element of elements) {
      const el = await element.getAttribute('style');
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
