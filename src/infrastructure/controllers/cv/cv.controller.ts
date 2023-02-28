import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ScrapperService } from '@infrastructure/scrapper/scrapper.service';
import { RegexService } from '@infrastructure/util/regex/regex.service';

@Controller('cv')
export class CvController {
  constructor(
    private readonly scrapperService: ScrapperService,
    private readonly regexService: RegexService,
  ) {}

  @Get()
  async get(@Query('url') url: string) {
    if (!url) {
      throw new BadRequestException('URL is required');
    }

    if (!this.regexService.isUrl(url)) {
      throw new BadRequestException('URL is invalid');
    }

    const file = await this.scrapperService.scrape(url);

    return {
      file,
    };
  }
}
