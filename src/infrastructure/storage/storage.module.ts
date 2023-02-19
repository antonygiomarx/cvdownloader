import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { S3Service } from '@infrastructure/storage/providers/amazon/s3.service';

@Module({
  providers: [StorageService, S3Service],
  imports: [AwsSdkModule.forFeatures([S3]), EnvironmentConfigModule],
  exports: [StorageService, S3Service],
})
export class StorageModule {}
