import { Injectable } from '@nestjs/common';
import { MainConfig } from '@domain/config/main.interface';
import { ConfigService } from '@nestjs/config';
import { TelegramConfig } from '@domain/config/telegram.interface';
import { AwsConfig } from '@domain/config/aws.interface';
import { ScrapperConfig } from '@domain/config/scrapper.interface';

@Injectable()
export class EnvironmentConfigService
  implements MainConfig, TelegramConfig, AwsConfig, ScrapperConfig
{
  constructor(private readonly configService: ConfigService) {}

  get port(): string {
    return this.configService.getOrThrow<string>('PORT');
  }

  get accessKeyId(): string {
    return this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID');
  }

  get bucket(): string {
    return this.configService.getOrThrow<string>('AWS_BUCKET');
  }

  get region(): string {
    return this.configService.getOrThrow<string>('AWS_REGION');
  }

  get secretAccessKey(): string {
    return this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY');
  }

  getScrapperTimeout(): string {
    return this.configService.getOrThrow<string>('SCRAPPER_TIMEOUT') || '10000';
  }

  getTelegramToken(): string {
    return this.configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN');
  }

  getTelegramWebhookUrl(): string {
    return this.configService.getOrThrow<string>('TELEGRAM_WEBHOOK_URL');
  }
}
