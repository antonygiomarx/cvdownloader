import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { TelegramModule } from 'nestjs-telegram';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [BotService],
  imports: [
    TelegramModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        botKey: configService.get('TELEGRAM_BOT_TOKEN'),
      }),
    }),
  ],
})
export class BotModule {}
