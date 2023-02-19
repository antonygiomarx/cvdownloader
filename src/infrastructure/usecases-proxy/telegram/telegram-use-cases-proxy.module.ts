import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule } from '@infrastructure/logger/logger.module';
import { HttpModule } from '@infrastructure/http/http.module';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { BotModule } from '@infrastructure/bot/bot.module';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { HttpService } from '@infrastructure/http/http.service';
import { SetWebhookUseCases } from '@usecases/telegram/set-webhook.usecases';
import { UseCasesProxy } from '@infrastructure/usecases-proxy/use-cases-proxy';
import { TelegramService } from '@infrastructure/messaging/providers/telegram/telegram.service';
import { SendTelegramMessageUseCases } from '@usecases/telegram/send-telegram-message-use.cases';
import { MessagingModule } from '@infrastructure/messaging/messaging.module';
import { BotService } from '@infrastructure/bot/bot.service';
import { HandleTelegramMessagesUsecases } from '@usecases/telegram/handle-telegram-messages.usecases';
import { SendTelegramFileUseCases } from '@usecases/telegram/send-telegram-file.usecases';
import { ScrapperModule } from '@infrastructure/scrapper/scrapper.module';
import { ScrapperService } from '@infrastructure/scrapper/scrapper.service';
import { RegexService } from '@infrastructure/util/regex/regex.service';
import { UtilModule } from '@infrastructure/util/util.module';

@Module({
  imports: [
    LoggerModule,
    HttpModule,
    EnvironmentConfigModule,
    BotModule,
    MessagingModule,
    ScrapperModule,
    UtilModule,
  ],
})
export class TelegramUseCasesProxyModule {
  static register(): DynamicModule {
    return {
      module: TelegramUseCasesProxyModule,
      providers: [
        {
          inject: [LoggerService, EnvironmentConfigService, HttpService],
          provide: SetWebhookUseCases.USE_CASE,
          useFactory: (
            logger: LoggerService,
            envConfig: EnvironmentConfigService,
            http: HttpService,
          ) =>
            new UseCasesProxy(new SetWebhookUseCases(http, envConfig, logger)),
        },
        {
          inject: [TelegramService],
          provide: SendTelegramMessageUseCases.USE_CASE,
          useFactory: (telegramService: TelegramService) =>
            new UseCasesProxy(new SendTelegramMessageUseCases(telegramService)),
        },
        {
          inject: [TelegramService],
          provide: SendTelegramFileUseCases.USE_CASE,
          useFactory: (telegramService: TelegramService) =>
            new UseCasesProxy(new SendTelegramFileUseCases(telegramService)),
        },
        {
          inject: [
            BotService,
            ScrapperService,
            RegexService,
            SendTelegramMessageUseCases.USE_CASE,
            SendTelegramFileUseCases.USE_CASE,
          ],
          provide: HandleTelegramMessagesUsecases.USE_CASE,
          useFactory: (
            botService: BotService,
            scrapperService: ScrapperService,
            regexService: RegexService,
            sendTelegramMessageUseCases: SendTelegramMessageUseCases,
            sendTelegramFileUseCases: SendTelegramFileUseCases,
          ) =>
            new UseCasesProxy(
              new HandleTelegramMessagesUsecases(
                sendTelegramMessageUseCases,
                sendTelegramFileUseCases,
                botService,
                scrapperService,
                regexService,
              ),
            ),
        },
      ],
      exports: [
        SetWebhookUseCases.USE_CASE,
        SendTelegramMessageUseCases.USE_CASE,
        SendTelegramFileUseCases.USE_CASE,
        HandleTelegramMessagesUsecases.USE_CASE,
      ],
    };
  }
}
