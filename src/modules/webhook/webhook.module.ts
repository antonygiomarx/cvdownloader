import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { TelegramService } from '../channels/telegram/telegram.service';
import { ChannelsModule } from '../channels/channels.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, TelegramService],
  imports: [ChannelsModule, HttpModule],
})
export class WebhookModule {}
