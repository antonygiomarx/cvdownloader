import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapperService } from './modules/shared/scrapper/scrapper.service';
import { ConfigModule } from '@nestjs/config';
import { PdfService } from './modules/shared/pdf/pdf.service';
import { StorageService } from './modules/shared/storage/storage.service';
import { WebhookModule } from './modules/webhook/webhook.module';
import { BotModule } from './modules/bot/bot.module';
import { ChannelsModule } from './modules/channels/channels.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WebhookModule,
    BotModule,
    ChannelsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ScrapperService, PdfService, StorageService],
  exports: [],
})
export class AppModule {}
