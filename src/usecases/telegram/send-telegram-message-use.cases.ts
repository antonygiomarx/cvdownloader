import { UseCases } from '@domain/usecases/usecases';
import { TelegramService } from '@infrastructure/messaging/providers/telegram/telegram.service';

export class SendTelegramMessageUseCases extends UseCases {
  static USE_CASE = 'SendTelegramMessage';

  constructor(private readonly telegramService: TelegramService) {
    super(SendTelegramMessageUseCases.USE_CASE);
  }

  async execute(userId: string, message: string) {
    return await this.telegramService.sendMessage(userId, message);
  }
}
