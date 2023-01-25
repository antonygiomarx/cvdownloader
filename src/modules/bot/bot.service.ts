import { Injectable } from '@nestjs/common';
import { TelegramService } from 'nestjs-telegram';

@Injectable()
export class BotService {
  constructor(private readonly bot: TelegramService) {}

  async sendMessage(chatId: number, message: string) {
    return this.bot
      .sendMessage({
        chat_id: chatId,
        text: message,
      })
      .toPromise();
  }

  async sendFile(chatId: number, file: string) {
    return this.bot
      .sendDocument({
        chat_id: chatId,
        document: file,
      })
      .toPromise();
  }
}
