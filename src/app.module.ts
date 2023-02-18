import { BotModule } from '@infrastructure/bot/bot.module';
import { SharedModule } from '@modules/shared/shared.module';
import { StorageModule } from '@modules/storage/storage.module';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { HttpModule } from '@infrastructure/http/http.module';
import { ScrapperModule } from '@modules/scrapper/scrapper.module';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { LoggerModule } from '@infrastructure/logger/logger.module';
import { ControllersModule } from '@infrastructure/controllers/controllers.module';
import { AppController } from '@app.controller';
import { AppService } from '@app.service';
import { ScrapperService } from '@modules/scrapper/scrapper.service';
import { PdfService } from '@modules/shared/pdf/pdf.service';
import { Module } from '@nestjs/common';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { UseCasesProxyModule } from './infrastructure/usecases-proxy/use-cases-proxy.module';
import { MessagingModule } from '@infrastructure/messaging/messaging.module';

@Module({
  imports: [
    BotModule,
    SharedModule,
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
  ],
  controllers: [AppController],
  providers: [AppService, ScrapperService, PdfService],
  exports: [],
})
export class AppModule {}
