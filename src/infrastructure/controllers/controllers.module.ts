import { Module } from '@nestjs/common';
import { TelegramController } from '@infrastructure/controllers/telegram/telegram.controller';
import { HttpModule } from '@infrastructure/http/http.module';
import { BotModule } from '@infrastructure/bot/bot.module';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { LoggerModule } from '@infrastructure/logger/logger.module';
import { UseCasesProxyModule } from '@infrastructure/usecases-proxy/use-cases-proxy.module';
import { ScrapperModule } from '@infrastructure/scrapper/scrapper.module';
import { DefaultController } from './default/default.controller';

@Module({
  imports: [
    UseCasesProxyModule,
    ScrapperModule,
    HttpModule,
    BotModule,
    EnvironmentConfigModule,
    LoggerModule,
  ],
  controllers: [TelegramController, DefaultController],
})
export class ControllersModule {}
