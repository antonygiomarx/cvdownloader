import { Injectable, Logger } from '@nestjs/common';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocalStorageService {
  readonly logger = new Logger(LocalStorageService.name);
  readonly publicPath = join(__dirname, '../', '../', '../', '../public');
  readonly tempPath = join(this.publicPath, '/temp');

  constructor(private configService: ConfigService) {}

  async save(filename: string | undefined, data: Buffer) {
    if (!existsSync(this.publicPath)) await mkdir(this.publicPath);
    if (!existsSync(this.tempPath)) await mkdir(this.tempPath);

    filename
      ? (filename = filename + '.pdf')
      : (filename = new Date().getTime() + '.pdf');

    const path = join(this.tempPath, filename);

    await writeFile(path, data);

    this.logger.log(`Saved file to ${path}`);

    const url =
      this.configService.get('HOST') + path.replace(this.publicPath, '');

    return {
      url,
      filename,
    };
  }
}
