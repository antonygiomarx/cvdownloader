import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramService as TelegramProviderService } from 'nestjs-telegram';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TelegramService {
  readonly logger = new Logger(TelegramService.name);
  private readonly webHookUrl: string = 'https://api.telegram.org/bot';

  constructor(
    private readonly core: TelegramProviderService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async setWebhook(url: string) {
    try {
      const req = this.httpService.post(
        `${this.webHookUrl}${this.configService.get(
          'TELEGRAM_BOT_TOKEN',
        )}/setWebhook?url=${url}`,
      );

      const { data } = await lastValueFrom(req);

      return data;
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(error);
    }
  }

  async sendMessage(chatId: string, text: string) {
    try {
      this.logger.log(`Sending message to ${chatId}`);

      return await this.core
        .sendMessage({
          text,
          chat_id: chatId,
        })
        .toPromise();
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(error);
    }
  }

  async sendFile(chatId: string, file: string) {
    try {
      this.logger.log(`Sending file to ${chatId}, ${file}`);

      return await this.core
        .sendDocument({
          document: file,
          thumb: file,
          chat_id: chatId,
          caption: 'Your resume',
        })
        .toPromise();
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException('Error while sending file');
    }
  }
}
