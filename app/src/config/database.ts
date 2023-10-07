import { registerAs } from '@nestjs/config';
import { findEnvByKey } from './util/findEnvByKey';

type DatabaseConfig = {
  CONNECTION_STRING: string;
  DEV_CONNECTION_STRING: string;
  LOCAL_CONNECTION_STRING: string;
};

export const DATABASE_CONFIG_KEY = 'database';

export const DATABASE_CONFIG = registerAs(DATABASE_CONFIG_KEY, () => {
  const NAME = findEnvByKey('DB_NAME');

  const USERNAME = findEnvByKey('DB_USERNAME');
  const PASSWORD = findEnvByKey('DB_PASSWORD');
  const ENDPOINT = findEnvByKey('DB_ENDPOINT');

  const DEV_USERNAME = findEnvByKey('DEV_DB_USERNAME');
  const DEV_PASSWORD = findEnvByKey('DEV_DB_PASSWORD');
  const DEV_ENDPOINT = findEnvByKey('DEV_DB_ENDPOINT');

  const LOCAL_USERNAME = findEnvByKey('LOCAL_DB_USERNAME');
  const LOCAL_PASSWORD = findEnvByKey('LOCAL_DB_PASSWORD');
  const LOCAL_ENDPOINT = findEnvByKey('LOCAL_DB_ENDPOINT');

  return {
    CONNECTION_STRING: `mongodb://${USERNAME}:${PASSWORD}@${ENDPOINT}/${NAME}`,
    DEV_CONNECTION_STRING: `mongodb://${DEV_USERNAME}:${DEV_PASSWORD}@${DEV_ENDPOINT}/${NAME}`,
    LOCAL_CONNECTION_STRING: `mongodb://${LOCAL_USERNAME}:${LOCAL_PASSWORD}@${LOCAL_ENDPOINT}/${NAME}`,
  } satisfies DatabaseConfig;
});
