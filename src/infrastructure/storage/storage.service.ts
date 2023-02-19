import { Injectable } from '@nestjs/common';
import { S3Service } from '@infrastructure/storage/providers/amazon/s3.service';

@Injectable()
export class StorageService {
  constructor(private readonly s3Service: S3Service) {}

  async save(file: Express.Multer.File) {
    return await this.s3Service.upload(file);
  }
}
