import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapperService } from './modules/scrapper/scrapper.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PdfService } from './modules/shared/pdf/pdf.service';
import { LocalStorageService } from './modules/storage/providers/local/local-storage.service';
import { WebhookModule } from './modules/webhook/webhook.module';
import { BotModule } from './modules/bot/bot.module';
import { ChannelsModule } from './modules/channels/channels.module';
import { SharedModule } from './modules/shared/shared.module';
import { StorageModule } from './modules/storage/storage.module';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { ScrapperModule } from './modules/scrapper/scrapper.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WebhookModule,
    BotModule,
    ChannelsModule,
    SharedModule,
    StorageModule,
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        imports: [],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          region: configService.get('AWS_REGION'),
          credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
          },
        }),
      },
      services: [S3],
    }),
    HttpModule,
    ScrapperModule,
  ],
  controllers: [AppController],
  providers: [AppService, ScrapperService, PdfService, LocalStorageService],
  exports: [],
})
export class AppModule {}
