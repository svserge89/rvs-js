import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import {get as getConfig} from 'config';

import {DatabaseConfig} from './types/database-config.interface';

const config = getConfig<DatabaseConfig>('database');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? config.host,
  port: process.env.DATABASE_PORT
    ? Number.parseInt(process.env.DATABASE_PORT)
    : config.port,
  database: process.env.DATABASE_NAME ?? config.database,
  username: process.env.DATABASE_USERNAME ?? config.username,
  password: process.env.DATABASE_PASSWORD ?? config.password,
  autoLoadEntities: true,
  synchronize: false,
  logging: config.logging,
};
