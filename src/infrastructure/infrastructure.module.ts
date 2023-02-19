import { Module } from '@nestjs/common';
import { PdfModule } from './pdf/pdf.module';
import { BotModule } from '@infrastructure/bot/bot.module';
import { AwsSdkModule } from 'nest-aws-sdk';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { S3 } from 'aws-sdk';
import { HttpModule } from '@infrastructure/http/http.module';
import { ScrapperModule } from '@infrastructure/scrapper/scrapper.module';
import { LoggerModule } from '@infrastructure/logger/logger.module';
import { ControllersModule } from '@infrastructure/controllers/controllers.module';
import { UseCasesProxyModule } from '@infrastructure/usecases-proxy/use-cases-proxy.module';
import { MessagingModule } from '@infrastructure/messaging/messaging.module';
import { UtilModule } from './util/util.module';
import { StorageModule } from '@infrastructure/storage/storage.module';

@Module({
  imports: [
    PdfModule,
    BotModule,
    StorageModule,
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        imports: [EnvironmentConfigModule],
        inject: [EnvironmentConfigService],
        useFactory: (configService: EnvironmentConfigService) => ({
          region: configService.region,
          credentials: {
            accessKeyId: configService.accessKeyId,
            secretAccessKey: configService.secretAccessKey,
          },
        }),
      },
      services: [S3],
    }),
    HttpModule,
    ScrapperModule,
    EnvironmentConfigModule,
    LoggerModule,
    ControllersModule,
    UseCasesProxyModule,
    MessagingModule,
    UtilModule,
  ],
})
export class InfrastructureModule {}
