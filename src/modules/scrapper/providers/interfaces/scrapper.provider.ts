import { HttpService } from '@nestjs/axios';

export interface ScrapperProvider {
  core: unknown;

  httpService?: HttpService;

  scrape(): Promise<Buffer[]>;
}
