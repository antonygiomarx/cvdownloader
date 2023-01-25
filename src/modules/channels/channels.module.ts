import { Module } from '@nestjs/common';
import { TelegramProvider } from './providers/telegram';
import { TelegramModule } from 'nestjs-telegram';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TelegramModule, HttpModule],
  providers: [TelegramProvider],
  exports: [TelegramProvider, HttpModule],
})
export class ChannelsModule {}
