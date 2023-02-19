import { Injectable, Logger } from '@nestjs/common';
import * as playwright from 'playwright';
import { RegexService } from '@infrastructure/util/regex/regex.service';
import { ScrapperProvider } from '@domain/scrapper/providers/provider.interface';

@Injectable()
export class PlaywrightService implements ScrapperProvider {
  core: playwright.Browser;
  page: playwright.Page;
  private readonly logger = new Logger(PlaywrightService.name);

  constructor(private readonly regexService: RegexService) {}

  async scrape(url: string, timeout: number): Promise<Buffer[]> {
    try {
      if (!this.core) this.core = await playwright.chromium.launch();

      if (!this.page) this.page = await this.core.newPage();

      await this.page.goto(url);

      await this.page.waitForTimeout(timeout);

      const elements = await this.page.$$('.pdf-viewer__page');

      if (!elements) throw new Error('No elements found!');

      const items = [];

      for (const element of elements) {
        const el = await element.getAttribute('style');

        if (!el) continue;

        const [url] = this.regexService.isUrl(el);

        items.push(url);
      }

      const urls = items.filter((item) => item).map((item) => new URL(item));

      const pdfs = [] as Buffer[];

      for (const url of urls) {
        await this.page.goto(url.href);
        await this.page.waitForTimeout(timeout / 2);

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

      await this.core.close();

      return pdfs;
    } catch (e) {
      this.logger.error(e);
    }
  }
}
