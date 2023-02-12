import * as cheerio from 'cheerio';
import { HttpService } from '@nestjs/axios';
import { ScrapperProvider } from '@/modules/scrapper/providers/interfaces/scrapper.provider';
import { lastValueFrom } from 'rxjs';

export class CheerioProvider implements ScrapperProvider {
  core = cheerio;

  constructor(readonly httpService: HttpService) {}

  async scrape(url: string): Promise<any> {
    // return a promise response
    const { data } = await lastValueFrom(this.httpService.get(url));

    const $ = this.core.load(data);

    const elements = $('.pdf-viewer__page');

    if (!elements) throw new Error('No elements found!');

    const items = [];

    for (const element of elements) {
      const el = $(element).attr('style');

      if (!el) continue;

      const url = el.match(/url\((.*?)\)/);

      items.push(url);
    }

    return items.filter((item) => item).map((item) => new URL(item[1]));
  }
}
