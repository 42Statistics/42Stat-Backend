import { registerAs } from '@nestjs/config';
import { findEnvByKey } from './util/findEnvByKey';

export type DatabaseConfig = {
  USERNAME: string;
  PASSWORD: string;
  ENDPOINT: string;
  NAME: string;
};

export const DATABASE_CONFIG = 'database';

export const databaseConfig = registerAs(
  DATABASE_CONFIG,
  () =>
    ({
      USERNAME: findEnvByKey('DB_USERNAME'),
      PASSWORD: findEnvByKey('DB_PASSWORD'),
      ENDPOINT: findEnvByKey('DB_ENDPOINT'),
      NAME: findEnvByKey('DB_NAME'),
    } satisfies DatabaseConfig),
);
