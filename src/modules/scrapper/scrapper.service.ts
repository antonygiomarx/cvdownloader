import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PdfService } from '../shared/pdf/pdf.service';
import { ResumeioStrategy } from './strategies/resumeio.strategy';
import { StorageService } from '@/modules/storage/storage.service';
import { ScrapperProvider } from '@/modules/scrapper/providers/interfaces/scrapper.provider';

@Injectable()
export class ScrapperService {
  provider: ScrapperProvider;
  timeout: number;
  private readonly logger = new Logger(ScrapperService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly pdfService: PdfService,
    private readonly storageService: StorageService,
  ) {
    this.logger.log('ScrapperService initialized!');

    this.timeout = +this.config.get<number>('CRAWL_TIMEOUT') || 15000;
  }

  async scrape(url: string): Promise<string> {
    if (!url) {
      throw new BadRequestException('URL is required');
    }

    const resumeioStrategy = new ResumeioStrategy(url, this.timeout);

    const pdfs = await resumeioStrategy.build();

    this.logger.log(`Found ${pdfs.length} PDFs`);

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
