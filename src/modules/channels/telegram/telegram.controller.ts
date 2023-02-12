import { Body, Controller, Logger, Post } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { SetWebhookDto } from '@/modules/channels/telegram/dtos/set-webhook.dto';
import { TelegramWebhookMessageEvent } from '@/modules/channels/telegram/interfaces/webhook-event.interface';
import { RegexUtil } from '@/modules/util/regex.util';
import { GenericFlow } from '@/modules/bot/flow/generic-flow';
import { ScrapperService } from '@/modules/scrapper/scrapper.service';

@Controller('telegram')
export class TelegramController {
  private readonly logger = new Logger(TelegramController.name);

  constructor(
    private readonly telegramService: TelegramService,
    private readonly scrapperService: ScrapperService,
  ) {}

  @Post('setWebhook')
  async setWebhook(
    @Body()
    body: SetWebhookDto,
  ) {
    return await this.telegramService.setWebhook(body.url);
  }

  @Post('webhook')
  async webhook(
    @Body()
    webhookMessageEvent: TelegramWebhookMessageEvent,
  ) {
    this.logger.log(
      `Received message from ${webhookMessageEvent.message.from.first_name}  (${webhookMessageEvent.message.from.username})`,
    );

    const { message } = webhookMessageEvent;
    const { text } = message;

    try {
      if (text === 'ping') {
        this.logger.log('Start command received');

        return await this.telegramService.sendMessage(
          message.chat.id.toString(),
          'pong',
        );
      }

      if (!text.match(RegexUtil.url)) {
        this.logger.log('No URL found');

        await this.telegramService.sendMessage(
          message.chat.id.toString(),
          GenericFlow.noUrlMessage.text,
        );

        return 'ok';
      }

      const url = text.match(RegexUtil.url)[0];

      this.logger.log(`URL found: ${url}`);

      await this.telegramService.sendMessage(
        message.chat.id.toString(),
        'Estamos trabajando en ello, por favor espera un momento.',
      );

      const path = await this.scrapperService.scrape(url);

      if (!path) {
        this.logger.log('No file found');

        await this.telegramService.sendMessage(
          message.chat.id.toString(),
          GenericFlow.noFileFound.text,
        );

        return 'ok';
      }

      await this.telegramService.sendFile(message.chat.id.toString(), path);

      return 'ok';
    } catch (error) {
      this.logger.error(error);

      await this.telegramService.sendMessage(
        message.chat.id.toString(),
        GenericFlow.error.text,
      );

      return 'ok';
    }
  }
}
