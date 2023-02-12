import { BaseStrategy } from './base.strategy';
import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CheerioProvider } from '@/modules/scrapper/providers/cheerio.provider';
import { RegexUtil } from '@/modules/util/regex.util';

export class ResumeioStrategy implements BaseStrategy {
  urlRegex = RegexUtil.url;
  private readonly logger = new Logger(ResumeioStrategy.name);

  constructor(
    private readonly url: string,
    private readonly timeout: number,
    private readonly httpService: HttpService,
  ) {}

  async build(): Promise<Buffer[]> {
    const cheerioProvider = new CheerioProvider(this.httpService);

    const urls = await cheerioProvider.scrape(this.url);

    this.logger.log(`Found ${urls.length} PDFs`);

    return [];
  }
}
