import { Module } from '@nestjs/common';
import { TelegramProvider } from './providers/telegram';
import { HttpModule } from '@nestjs/axios';
import { TelegramModule, TelegramService } from 'nestjs-telegram';
import { AppModule } from 'src/app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  ],
  providers: [TelegramProvider],
  exports: [TelegramProvider, TelegramModule],
})
export class ChannelsModule {}
