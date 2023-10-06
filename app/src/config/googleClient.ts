import { registerAs } from '@nestjs/config';
import { findEnvByKey } from './util/findEnvByKey';

type GoogleClientConfig = {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  REDIRECT_URL: string;
};

export const GOOGLE_CLIENT_CONFIG = registerAs(
  'googleClient',
  () =>
    ({
      CLIENT_ID: findEnvByKey('GOOGLE_CLIENT_ID'),
      CLIENT_SECRET: findEnvByKey('GOOGLE_CLIENT_SECRET'),
      REDIRECT_URL: findEnvByKey('GOOGLE_REDIRECT_URL'),
    } satisfies GoogleClientConfig),
);
