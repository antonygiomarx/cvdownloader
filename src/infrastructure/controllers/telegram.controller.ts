import { Body, Controller, Inject, Post } from '@nestjs/common';
import { SetWebhookUseCases } from '@usecases/telegram/set-webhook.usecases';
import { UseCasesProxy } from '@infrastructure/usecases-proxy/use-cases-proxy';
import { HandleTelegramMessagesUsecases } from '@usecases/telegram/handle-telegram-messages.usecases';
import { WebhookMessageEvent } from '@domain/messaging/providers/telegram/webhook.interface';
import { SetWebhookDto } from '@domain/messaging/providers/telegram/dtos/set-webhook.dto';

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
    { message }: WebhookMessageEvent,
  ) {
    return await this.handleTelegramMessagesUseCases
      .getInstance()
      .execute(message);
  }
}
