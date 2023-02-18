import { Module } from '@nestjs/common';
import { TelegramUseCasesProxyModule } from '@infrastructure/usecases-proxy/telegram/telegram-use-cases-proxy.module';

@Module({
  imports: [TelegramUseCasesProxyModule.register()],
  exports: [TelegramUseCasesProxyModule],
})
export class UseCasesProxyModule {}
