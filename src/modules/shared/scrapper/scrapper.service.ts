import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PdfService } from '../pdf/pdf.service';
import { ResumeioStrategy } from './strategies/resumeio.strategy';
import { PlaywrightProvider } from './providers/playwright';
import { RegexUtil } from '../../util/regex.util';
import { StorageService } from '@/modules/storage/storage.service';

@Injectable()
export class ScrapperService {
  provider: PlaywrightProvider;
  timeout: number;
  private readonly logger = new Logger(ScrapperService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly pdfService: PdfService,
    private readonly storageService: StorageService,
  ) {
    this.logger.log('ScrapperService initialized!');

    this.timeout = +this.config.get<number>('CRAWL_TIMEOUT') || 15000;

    this.logger.log(`Crawl timeout: ${this.timeout}ms `);

    this.provider = new PlaywrightProvider();
  }

  async scrape(url: string): Promise<string> {
    this.logger.log(`Crawling ${url}`);

    const browser = await this.provider.core.launch({
      headless: true,
    });

    const page = await browser.newPage();

    if (!url) {
      throw new BadRequestException('URL is required');
    }

    const scrapper = new ResumeioStrategy(
      RegexUtil.url,
      page,
      url,
      this.timeout,
    );

    const pdfs = await scrapper.scrape();

    const file = await this.pdfService.combine(pdfs);

    await browser.close();

    return await this.storageService.save(file);
  }
}
