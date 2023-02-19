export interface Provider {
  upload(file: Express.Multer.File): Promise<string>;

  delete(file: Express.Multer.File): Promise<void>;

  getSignedUrl(file: Express.Multer.File): Promise<string>;
}
