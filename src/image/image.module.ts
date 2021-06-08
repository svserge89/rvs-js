import {Module} from '@nestjs/common';

import {ImageValidationPipe} from './pipe/image-validation.pipe';
import {ImageService} from './image.service';

@Module({
  providers: [ImageService, ImageValidationPipe],
  exports: [ImageService, ImageValidationPipe],
})
export class ImageModule {}
