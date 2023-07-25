import { registerAs } from '@nestjs/config';
import { findEnvByKey } from './util/findEnvByKey';

export type FtClientConfig = {
  ID: string;
  SECRET: string;
  REDIRECT_URI: string;
  INTRA_TOKEN_URL: string;
  INTRA_ME_URL: string;
};

export const FT_CLIENT_CONFIG = 'ftClient';

export const ftClientConfig = registerAs(
  FT_CLIENT_CONFIG,
  () =>
    ({
      ID: findEnvByKey('CLIENT_ID'),
      SECRET: findEnvByKey('CLIENT_SECRET'),
      REDIRECT_URI: findEnvByKey('REDIRECT_URI'),
      INTRA_TOKEN_URL: findEnvByKey('INTRA_TOKEN_URL'),
      INTRA_ME_URL: findEnvByKey('INTRA_ME_URL'),
    } satisfies FtClientConfig),
);