import { Module } from '@nestjs/common';
import { TelegramService } from './telegram/telegram.service';
import { HttpModule } from '@nestjs/axios';
import { TelegramModule } from 'nestjs-telegram';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegramController } from '@/modules/channels/telegram/telegram.controller';
import { ScrapperModule } from '@/modules/scrapper/scrapper.module';

@Module({
  imports: [
    HttpModule,
    TelegramModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        botKey: configService.get('TELEGRAM_BOT_TOKEN'),
      }),
    }),
    ScrapperModule,
  ],
  providers: [TelegramService],
  exports: [TelegramService, TelegramModule],
  controllers: [TelegramController],
})
export class ChannelsModule {}
