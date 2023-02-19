import { BaseStrategyInterface } from '@domain/scrapper/strategies/base-strategy.interface';
import { Logger } from '@nestjs/common';
import { PlaywrightService } from '@infrastructure/scrapper/providers/playwright/playwright.service';

export class ResumeioStrategy implements BaseStrategyInterface {
  private readonly logger = new Logger(ResumeioStrategy.name);

  constructor(
    private readonly url: string,
    private readonly timeout: number,
    private readonly playwrightService: PlaywrightService,
  ) {}

  async build(): Promise<Buffer[]> {
    try {
      return await this.playwrightService.scrape(this.url, this.timeout);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
