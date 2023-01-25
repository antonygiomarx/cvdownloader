import { Controller, Get, Res } from '@nestjs/common';
import { ScrapperService } from './modules/shared/scrapper/scrapper.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly crawlerService: ScrapperService) {}

  @Get()
  async getHello(@Res() res: Response) {
    res.sendFile(await this.crawlerService.scrape());
  }
}
