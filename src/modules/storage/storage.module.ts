import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { S3StorageService } from '@/modules/storage/providers/amazon/s3-storage-service.provider';
import { LocalStorageService } from '@/modules/storage/providers/local/local-storage.service';

@Module({
  controllers: [],
  providers: [StorageService, S3StorageService, LocalStorageService],
  imports: [AwsSdkModule.forFeatures([S3])],
  exports: [StorageService, S3StorageService, LocalStorageService],
})
export class StorageModule {}
