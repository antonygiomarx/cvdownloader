import { InternalServerErrorException } from '@nestjs/common';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { HttpService } from '@infrastructure/http/http.service';
import { UseCases } from '@domain/usecases/usecases';

export class SetWebhookUseCases extends UseCases {
  static USE_CASE = 'SetTelegramWebhook';

  constructor(
    private readonly httpService: HttpService,
    private readonly environmentConfigService: EnvironmentConfigService,
    private readonly loggerService: LoggerService,
  ) {
    super(SetWebhookUseCases.USE_CASE);
  }

  async execute(url: string) {
    try {
      const webhookUrl = this.environmentConfigService.getTelegramWebhookUrl();
      const telegramToken = this.environmentConfigService.getTelegramToken();

      return this.httpService.post(
        `${webhookUrl}${telegramToken}/setWebhook?url=${url}`,
      );
    } catch (error) {
      this.loggerService.error('SetWebhookUsesCases - execute', error);
      throw new InternalServerErrorException(error);
    }
  }
}
