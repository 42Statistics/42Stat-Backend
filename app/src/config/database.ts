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

export const databaseConfig = registerAs(DATABASE_CONFIG, () => {
  const USERNAME = findEnvByKey('DB_USERNAME');
  const PASSWORD = findEnvByKey('DB_PASSWORD');
  const ENDPOINT = findEnvByKey('DB_ENDPOINT');
  const NAME = findEnvByKey('DB_NAME');
  const CONNECTION_STRING = `mongodb://${USERNAME}:${PASSWORD}@${ENDPOINT}/${NAME}`;

  return {
    USERNAME,
    PASSWORD,
    ENDPOINT,
    NAME,
    CONNECTION_STRING,
  } satisfies DatabaseConfig;
});
