import { registerAs } from '@nestjs/config';
import { findEnvByKey } from './util/findEnvByKey';

type GoogleClientConfig = {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  DEV_CLIENT_ID: string;
  DEV_CLIENT_SECRET: string;
  LOCAL_CLEINT_ID: string;
  LOCAL_CLIENT_SECRET: string;
};

export const GOOGLE_CLIENT_CONFIG = registerAs(
  'googleClient',
  () =>
    ({
      CLIENT_ID: findEnvByKey('GOOGLE_CLIENT_ID'),
      CLIENT_SECRET: findEnvByKey('GOOGLE_CLIENT_SECRET'),
      DEV_CLIENT_ID: findEnvByKey('DEV_GOOGLE_CLIENT_ID'),
      DEV_CLIENT_SECRET: findEnvByKey('DEV_GOOGLE_CLIENT_SECRET'),
      LOCAL_CLEINT_ID: findEnvByKey('LOCAL_GOOGLE_CLIENT_ID'),
      LOCAL_CLIENT_SECRET: findEnvByKey('LOCAL_GOOGLE_CLIENT_SECRET'),
    } satisfies GoogleClientConfig),
);
