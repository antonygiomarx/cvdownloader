import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { PdfService } from '@infrastructure/pdf/pdf.service';
import { ResumeioStrategy } from '@infrastructure/scrapper/strategies/resumeio.strategy';
import { StorageService } from '@infrastructure/storage/storage.service';
import { PlaywrightService } from '@infrastructure/scrapper/providers/playwright/playwright.service';

@Injectable()
export class ScrapperService {
  timeout: number;
  private readonly logger = new Logger(ScrapperService.name);

  constructor(
    private readonly environmentConfigService: EnvironmentConfigService,
    private readonly pdfService: PdfService,
    private readonly storageService: StorageService,
    private readonly playwrightService: PlaywrightService,
  ) {
    this.timeout = +this.environmentConfigService.getScrapperTimeout();
  }

  async scrape(url: string): Promise<string> {
    if (!url) {
      throw new BadRequestException('URL is required');
    }

    const resumeioStrategy = new ResumeioStrategy(
      url,
      this.timeout,
      this.playwrightService,
    );

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
