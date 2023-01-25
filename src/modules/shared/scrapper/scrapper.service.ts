import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PdfService } from '../pdf/pdf.service';
import { StorageService } from '../storage/storage.service';
import { ResumeioStrategy } from './strategies/resumeio.strategy';
import { RegexUtil } from 'src/modules/regex.utl';
import { PlaywrightProvider } from './providers/playwright';

@Injectable()
export class ScrapperService {
  private readonly logger = new Logger(ScrapperService.name);

  provider = new PlaywrightProvider();

  timeout: number;

  url: string;

  constructor(
    private readonly config: ConfigService,
    private readonly pdfService: PdfService,
    private readonly storageService: StorageService,
  ) {
    this.logger.log('ScrapperService initialized!');

    this.url = this.config.get('CRAWL_URL');

    this.timeout = +this.config.get<number>('CRAWL_TIMEOUT') || 15000;

    this.logger.log(`Crawl timeout: ${this.timeout}, URL: ${this.url}, `);
  }

  async scrape(name?: string) {
    this.logger.log(`Crawling ${this.url}`);

    const browser = await this.provider.core.launch({
      headless: true,
    });

    const page = await browser.newPage();

    if (!this.url) {
      throw new BadRequestException('URL is required');
    }

    const scrapper = new ResumeioStrategy(
      RegexUtil.url,
      page,
      this.url,
      this.timeout,
    );

    const pdfs = await scrapper.scrape();

    const combinedPdfs = await this.pdfService.combine(pdfs);

    await browser.close();

    const path = await this.storageService.save(name, combinedPdfs);

    this.logger.log(`Saved file to ${path}`);

    return path;
  }
}
