import { UseCases } from '@domain/usecases/usecases';
import { TelegramService } from '@infrastructure/messaging/providers/telegram/telegram.service';

export class SendTelegramFileUseCases extends UseCases {
  static USE_CASE = 'SendTelegramFile';

  constructor(private readonly telegramService: TelegramService) {
    super(SendTelegramFileUseCases.USE_CASE);
  }

  async execute(userId: string, message: string) {
    return await this.telegramService.sendFile(userId, message);
  }
}
