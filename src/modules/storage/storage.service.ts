import { Injectable } from '@nestjs/common';
import { S3StorageService } from '@/modules/storage/providers/amazon/s3-storage-service.provider';

@Injectable()
export class StorageService {
  constructor(private readonly s3Service: S3StorageService) {}

  async save(file: Express.Multer.File) {
    return await this.s3Service.upload(file);
  }
}
