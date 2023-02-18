import { Module } from '@nestjs/common';
import { TelegramModule } from '@infrastructure/messaging/providers/telegram/telegram.module';

@Module({
  imports: [TelegramModule],
  exports: [TelegramModule],
})
export class ProvidersModule {}
