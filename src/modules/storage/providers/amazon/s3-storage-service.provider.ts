import { StorageProvider } from '@/modules/storage/providers/interfaces/storage.provider';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';

@Injectable()
export class S3StorageService extends StorageProvider {
  bucket: string;
  private readonly logger = new Logger(S3StorageService.name);

  constructor(
    @InjectAwsService(S3)
    private readonly s3: S3,
    private readonly configService: ConfigService,
  ) {
    super();
    this.bucket = this.configService.get('AWS_BUCKET');
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const { originalname, buffer } = file;

    const oneDay = 60 * 60 * 24;

    const params = {
      Bucket: this.configService.get('AWS_BUCKET'),
      Key: originalname,
      Body: buffer,
      Expires: new Date(Date.now() + oneDay),
      ACL: 'public-read',
    } as S3.Types.PutObjectRequest;

    const { Location } = await this.s3.upload(params).promise();

    this.logger.log(`Uploaded file ${originalname}`);

    return Location;
  }

  async delete(file: Express.Multer.File): Promise<void> {
    const { originalname } = file;

    const params = {
      Bucket: this.configService.get('AWS_BUCKET'),
      Key: originalname,
    };

    await this.s3.deleteObject(params).promise();

    this.logger.log(`Deleted file ${originalname}`);
  }

  async getSignedUrl(file: Express.Multer.File): Promise<string> {
    const { originalname } = file;

    const params = {
      Bucket: this.configService.get('AWS_BUCKET'),
      Key: originalname,
      Expires: 60 * 60,
    };

    const url = this.s3.getSignedUrl('getObject', params);

    this.logger.log(`Generated signed url for file ${originalname}`);

    return url;
  }
}
