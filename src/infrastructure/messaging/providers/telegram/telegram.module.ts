import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramModule as TelegramModuleProvider } from 'nestjs-telegram';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { LoggerModule } from '@infrastructure/logger/logger.module';

@Module({
  imports: [
    TelegramModuleProvider.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: (configService: EnvironmentConfigService) => ({
        botKey: configService.getTelegramToken(),
      }),
    }),
    LoggerModule,
  ],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
