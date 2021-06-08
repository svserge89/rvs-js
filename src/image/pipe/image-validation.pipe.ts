import {Injectable, PipeTransform} from '@nestjs/common';

import {InvalidImageException} from '../exception/invalid-image.exception';

const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/svg+xml',
];

@Injectable()
export class ImageValidationPipe
  implements PipeTransform<Express.Multer.File, Express.Multer.File>
{
  transform(value: Express.Multer.File): Express.Multer.File {
    if (!value || !ALLOWED_MIME_TYPES.includes(value.mimetype)) {
      throw new InvalidImageException();
    }

    return value;
  }
}
