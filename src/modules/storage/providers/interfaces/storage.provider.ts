export abstract class StorageProvider {
  abstract upload(file: Express.Multer.File): Promise<string>;

  abstract delete(file: Express.Multer.File): Promise<void>;

  abstract getSignedUrl(file: Express.Multer.File): Promise<string>;
}
