import mime from 'mime';

export class FileUtil {
  static bufferToMulterFile(
    buffer: Buffer,
    filename: string,
    type = 'application/octet-stream',
    mimetype = 'application/octet-stream',
  ): Express.Multer.File {
    return {
      buffer,
      originalname: filename,
      mimetype,
      size: buffer.length,
      filename,
    } as Express.Multer.File;
  }

  static getFileExtension(filename: string): string {
    return filename.split('.').pop();
  }

  static getMimeType(
    filename: string,
    defaultMimeType = 'application/octet-stream',
  ): string {
    const extension = FileUtil.getFileExtension(filename);
    const mimeType = mime.getType(extension);
    return mimeType || defaultMimeType;
  }
}
