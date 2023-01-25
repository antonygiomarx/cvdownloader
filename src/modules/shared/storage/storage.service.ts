import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class StorageService {
  async save(filename: string | undefined, data: Buffer) {
    const path = join(__dirname, (filename || new Date().getTime()) + '.pdf');

    await writeFile(path, data);

    return path;
  }
}
