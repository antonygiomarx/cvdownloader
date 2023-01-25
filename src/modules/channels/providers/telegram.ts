import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramService } from 'nestjs-telegram';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TelegramProvider {
  private readonly webHookUrl: string = 'https://api.telegram.org/bot';

  constructor(
    private readonly core: TelegramService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async setWebhook(url: string) {
    const req = this.httpService.post(
      `${this.webHookUrl}${this.configService.get(
        'TELEGRAM_BOT_TOKEN',
      )}/setWebhook?url=${url}`,
    );

    return await lastValueFrom(req);
  }
}
