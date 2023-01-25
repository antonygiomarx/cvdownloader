import { Page } from 'playwright';

export interface BaseStrategy {
  urlRegex: RegExp;

  scrape(page: Page, url: string, timeout: number): Promise<Buffer[]>;
}
