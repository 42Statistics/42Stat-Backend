import { registerAs } from '@nestjs/config';
import { findEnvByKey } from './util/findEnvByKey';

export type DatabaseConfig = {
  USERNAME: string;
  PASSWORD: string;
  ENDPOINT: string;
  NAME: string;
  CONNECTION_STRING: string;
};

export const DATABASE_CONFIG = 'database';

const USERNAME = findEnvByKey('DB_USERNAME');
const PASSWORD = findEnvByKey('DB_PASSWORD');
const ENDPOINT = findEnvByKey('DB_ENDPOINT');
const NAME = findEnvByKey('DB_NAME');

export const databaseConfig = registerAs(
  DATABASE_CONFIG,
  () =>
    ({
      USERNAME,
      PASSWORD,
      ENDPOINT,
      NAME,
      CONNECTION_STRING: `mongodb://${USERNAME}:${PASSWORD}@${ENDPOINT}/${NAME}`,
    } satisfies DatabaseConfig),
);
