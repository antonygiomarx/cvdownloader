import * as cheerio from 'cheerio';
import { HttpService } from '@nestjs/axios';
import { ScrapperProvider } from '@/modules/scrapper/providers/interfaces/scrapper.provider';
import { Logger } from '@nestjs/common';

export class CheerioProvider implements ScrapperProvider {
  private readonly logger = new Logger(CheerioProvider.name);
  core = cheerio;

  constructor(
    private url: string,
    private timeout: number,
    readonly httpService: HttpService,
  ) {}

  async scrape(): Promise<any> {
    try {
      // return a promise response
      const { data } = await this.httpService.get(this.url).toPromise();

      const $ = this.core.load(data);

      const elements = $('.pdf-viewer__page');

      this.logger.log(`Found ${elements.length} PDFs`);

      if (!elements) throw new Error('No elements found!');

      this.logger.log(elements);

      const items = [];

      for (const element of elements) {
        const el = $(element).attr('style');

        if (!el) continue;

        const url = el.match(/url\((.*?)\)/);

        items.push(url);
      }

      return items.filter((item) => item).map((item) => new URL(item[1]));
    } catch (e) {
      this.logger.error(e);
    }
  }
}
