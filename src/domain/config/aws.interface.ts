export interface AwsConfig {
  get accessKeyId(): string;

  get secretAccessKey(): string;

  get region(): string;

  get bucket(): string;
}
