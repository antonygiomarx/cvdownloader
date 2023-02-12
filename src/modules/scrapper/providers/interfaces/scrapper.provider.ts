import { HttpService } from '@nestjs/axios';

export interface ScrapperProvider {
  core: any;

  httpService?: HttpService;

  scrape(url: string): Promise<Buffer[]>;
}
