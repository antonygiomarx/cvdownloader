import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { TelegramProvider } from '../channels/providers/telegram';
import { ChannelsModule } from '../channels/channels.module';
import { TelegramModule } from 'nestjs-telegram';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, TelegramProvider],
  imports: [ChannelsModule, TelegramModule],
})
export class WebhookModule {}
