import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { TelegramProvider } from '../channels/providers/telegram';
import { ChannelsModule } from '../channels/channels.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, TelegramProvider],
  imports: [ChannelsModule, HttpModule],
})
export class WebhookModule {}
