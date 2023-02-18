import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { S3StorageService } from '@/modules/storage/providers/amazon/s3-storage-service.provider';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';

@Module({
  providers: [StorageService, S3StorageService],
  imports: [AwsSdkModule.forFeatures([S3]), EnvironmentConfigModule],
  exports: [StorageService, S3StorageService],
})
export class StorageModule {}
