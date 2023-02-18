import { Injectable } from '@nestjs/common';
import { TelegramService as TelegramProviderService } from 'nestjs-telegram';
import { LoggerService } from '@infrastructure/logger/logger.service';

@Injectable()
export class TelegramService {
  constructor(
    private readonly core: TelegramProviderService,
    private readonly logger: LoggerService,
  ) {}

  async sendMessage(chatId: string | number, text: string) {
    try {
      this.logger.log(
        'TelegramService - sendMessage',
        `Sending message to ${chatId}`,
      );

      return await this.core
        .sendMessage({
          text,
          chat_id: chatId,
        })
        .toPromise();
    } catch (error) {
      this.logger.error('TelegramService - sendMessage - error', error);
      return 'ok';
    }
  }

  async sendFile(chatId: string | number, file: string) {
    try {
      this.logger.log(
        TelegramService.name + 'sendFile',
        `Sending file to ${chatId}, ${file}`,
      );

      return await this.core
        .sendDocument({
          document: file,
          thumb: file,
          chat_id: chatId,
          caption: 'Your resume',
        })
        .toPromise();
    } catch (error) {
      this.logger.error(TelegramService.name + 'sendFile' + 'error', error);
      return 'ok';
    }
  }
}
