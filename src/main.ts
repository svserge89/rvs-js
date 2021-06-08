import './config/dotenv.config';

import {Logger} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import {get as getConfig} from 'config';

import {AppModule} from './app.module';
import {ServerConfig} from './config/types/server-config.interface';
import {IMAGE_DIR, IMAGE_URL_PREFIX} from './utils/image';

const DEFAULT_PORT = getConfig<ServerConfig>('server').port;

async function bootstrap() {
  const logger = new Logger('main');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT
    ? Number.parseInt(process.env.PORT)
    : DEFAULT_PORT;

  app.useStaticAssets(IMAGE_DIR, {prefix: IMAGE_URL_PREFIX});
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}

bootstrap();
