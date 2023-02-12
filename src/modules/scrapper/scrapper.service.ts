import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PdfService } from '../shared/pdf/pdf.service';
import { ResumeioStrategy } from './strategies/resumeio.strategy';
import { StorageService } from '@/modules/storage/storage.service';
import { ScrapperProvider } from '@/modules/scrapper/providers/interfaces/scrapper.provider';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ScrapperService {
  provider: ScrapperProvider;
  timeout: number;
  private readonly logger = new Logger(ScrapperService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly pdfService: PdfService,
    private readonly storageService: StorageService,
    private readonly httpService: HttpService,
  ) {
    this.logger.log('ScrapperService initialized!');

    this.timeout = +this.config.get<number>('CRAWL_TIMEOUT') || 15000;

    this.logger.log(`Crawl timeout: ${this.timeout}ms `);
  }

  async scrape(url: string): Promise<string> {
    this.logger.log(`Crawling ${url}`);

    if (!url) {
      throw new BadRequestException('URL is required');
    }

    const resumeioStrategy = new ResumeioStrategy(
      url,
      this.timeout,
      this.httpService,
    );

    const pdfs = await resumeioStrategy.build();

    if (!pdfs || pdfs.length === 0) {
      throw new Error('No PDFs found');
    }

    const file = await this.pdfService.combine(pdfs);

    if (!file) {
      throw new BadRequestException('Error during PDF combination');
    }

    return await this.storageService.save(file);
  }
}
