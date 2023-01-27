import { Module } from '@nestjs/common';
import { TelegramService } from './telegram/telegram.service';
import { HttpModule } from '@nestjs/axios';
import { TelegramModule } from 'nestjs-telegram';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegramController } from '@/modules/channels/telegram/telegram.controller';
import { SharedModule } from '@/modules/shared/shared.module';

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
    SharedModule,
  ],
  providers: [TelegramService],
  exports: [TelegramService, TelegramModule],
  controllers: [TelegramController],
})
export class ChannelsModule {}
