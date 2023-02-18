import { Module } from '@nestjs/common';
import { TelegramController } from '@infrastructure/controllers/telegram.controller';
import { ScrapperModule } from '@modules/scrapper/scrapper.module';
import { HttpModule } from '@infrastructure/http/http.module';
import { BotModule } from '@infrastructure/bot/bot.module';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { LoggerModule } from '@infrastructure/logger/logger.module';
import { UseCasesProxyModule } from '@infrastructure/usecases-proxy/use-cases-proxy.module';

@Module({
  imports: [
    UseCasesProxyModule,
    ScrapperModule,
    HttpModule,
    BotModule,
    EnvironmentConfigModule,
    LoggerModule,
  ],
  controllers: [TelegramController],
})
export class ControllersModule {}
