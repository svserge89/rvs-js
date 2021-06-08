import {Injectable} from '@nestjs/common';
import {Express} from 'express';
import {ensureDir, writeFile, remove, pathExists} from 'fs-extra';
import {join} from 'path';
import * as sharp from 'sharp';
import {v4 as uuid} from 'uuid';

import {IMAGE_DIR, IMAGE_URL_PREFIX} from '../utils/image';
import {Dimension} from './types/dimension.interface';

@Injectable()
export class ImageService {
  async save(
    file: Express.Multer.File,
    {height, width}: Dimension,
    path?: string,
  ): Promise<string> {
    let filePath = IMAGE_DIR;

    if (path) {
      filePath = join(IMAGE_DIR, path);
      await ensureDir(filePath);
    }

    const filename = uuid() + '.jpeg';
    const buffer = await sharp(file.buffer)
      .resize(width, height)
      .jpeg({mozjpeg: true})
      .toBuffer();

    await writeFile(join(filePath, filename), buffer);

    return `${IMAGE_URL_PREFIX}/${path ? path + '/' + filename : filename}`;
  }

  async delete(fileName: string) {
    const paths = fileName.split('/');
    const index = paths.indexOf(IMAGE_URL_PREFIX.slice(1)) + 1;
    const filePath = join(IMAGE_DIR, ...paths.slice(index));

    if (await pathExists(filePath)) {
      await remove(filePath);
    }
  }
}
