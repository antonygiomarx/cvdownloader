import { Body, Controller, Inject, Post } from '@nestjs/common';
import { SetWebhookDto } from '@/modules/channels/telegram/dtos/set-webhook.dto';
import { TelegramWebhookMessageEvent } from '@/modules/channels/telegram/interfaces/webhook-event.interface';

import { SetWebhookUseCases } from '@usecases/telegram/set-webhook.usecases';
import { UseCasesProxy } from '@infrastructure/usecases-proxy/use-cases-proxy';
import { HandleTelegramMessagesUsecases } from '@usecases/telegram/handle-telegram-messages.usecases';

@Controller('telegram')
export class TelegramController {
  constructor(
    @Inject(SetWebhookUseCases.USE_CASE)
    private readonly setWebhookUseCases: UseCasesProxy<SetWebhookUseCases>,
    @Inject(HandleTelegramMessagesUsecases.USE_CASE)
    private readonly handleTelegramMessagesUseCases: UseCasesProxy<HandleTelegramMessagesUsecases>,
  ) {}

  @Post('set-webhook')
  async setWebhook(
    @Body()
    { url }: SetWebhookDto,
  ) {
    return await this.setWebhookUseCases.getInstance().execute(url);
  }

  @Post('webhook')
  async webhook(
    @Body()
    { message }: TelegramWebhookMessageEvent,
  ) {
    return await this.handleTelegramMessagesUseCases
      .getInstance()
      .execute(message);
  }
}
