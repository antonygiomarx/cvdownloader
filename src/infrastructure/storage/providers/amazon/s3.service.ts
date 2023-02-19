import { Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { Provider } from '@domain/storage/provider.interface';

@Injectable()
export class S3Service implements Provider {
  bucket: string;
  private readonly logger = new Logger(S3Service.name);

  constructor(
    @InjectAwsService(S3)
    private readonly s3: S3,
    private readonly environmentConfigService: EnvironmentConfigService,
  ) {
    this.bucket = this.environmentConfigService.bucket;
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const { originalname, buffer } = file;

    const oneDay = 60 * 60 * 24;

    const params = {
      Bucket: this.environmentConfigService.bucket,
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
      Bucket: this.environmentConfigService.bucket,
      Key: originalname,
    };

    await this.s3.deleteObject(params).promise();

    this.logger.log(`Deleted file ${originalname}`);
  }

  async getSignedUrl(file: Express.Multer.File): Promise<string> {
    const { originalname } = file;

    const params = {
      Bucket: this.environmentConfigService.bucket,
      Key: originalname,
      Expires: 60 * 60,
    };

    const url = this.s3.getSignedUrl('getObject', params);

    this.logger.log(`Generated signed url for file ${originalname}`);

    return url;
  }
}
