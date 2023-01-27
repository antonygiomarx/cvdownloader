import { IsNotEmpty, IsString } from 'class-validator';

export class SetWebhookDto {
  @IsNotEmpty()
  @IsString()
  url: string;
}
