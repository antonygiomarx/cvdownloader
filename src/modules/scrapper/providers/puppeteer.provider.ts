import { Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { ScrapperProvider } from './interfaces/scrapper.provider';

export class PuppeteerProvider implements ScrapperProvider {
  private readonly logger = new Logger(PuppeteerProvider.name);
  core: puppeteer.Browser;
  page: puppeteer.Page;

  constructor(
    private readonly url: string,
    private readonly timeout: number,
    private readonly urlRegex: RegExp,
  ) {}

  async scrape(): Promise<any> {
    try {
      if (!this.core) this.core = await puppeteer.launch({ headless: false });

      if (!this.page) this.page = await this.core.newPage();

      await this.page.goto(this.url);

      await this.page.waitForTimeout(this.timeout);

      const elements = await this.page.$$eval('.pdf-viewer__page', (el) => {
        this.logger.log(el);

        return el.map((el) => el.getAttribute('style'));
      });

      if (!elements) throw new Error('No elements found!');

      this.logger.log(elements);

      const items = [];

      for (const element of elements) {
        const url = element.toString().match(this.urlRegex);
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
    } catch (e) {
      this.logger.error(e);
    }
  }
}
