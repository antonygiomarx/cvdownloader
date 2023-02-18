export interface Bot {
  noUrlMessage(): string;

  error(): string;

  noFile(): string;

  welcome(): string;

  help(): string;
}
