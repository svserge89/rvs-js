import './config/dotenv.config';

import {Logger} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {get as getConfig} from 'config';

import {AppModule} from './app.module';
import {ServerConfig} from './config/types/server-config.interface';

const DEFAULT_PORT = getConfig<ServerConfig>('server').port;

async function bootstrap() {
  const logger = new Logger('main');
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT
    ? Number.parseInt(process.env.PORT)
    : DEFAULT_PORT;

  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}

bootstrap();
