import { registerAs } from '@nestjs/config';
import { findEnvByKey } from './util/findEnvByKey';

type FtClientConfig = {
  ID: string;
  SECRET: string;
  REDIRECT_URI: string;
  DEV_ID: string;
  DEV_SECRET: string;
  DEV_REDIRECT_URI: string;
  LOCAL_ID: string;
  LOCAL_SECRET: string;
  LOCAL_REDIRECT_URI: string;
  INTRA_TOKEN_URL: string;
  INTRA_ME_URL: string;
};

export const FT_CLIENT_CONFIG = registerAs(
  'ftClient',
  () =>
    ({
      ID: findEnvByKey('CLIENT_ID'),
      SECRET: findEnvByKey('CLIENT_SECRET'),
      REDIRECT_URI: findEnvByKey('REDIRECT_URI'),
      DEV_ID: findEnvByKey('DEV_CLIENT_ID'),
      DEV_SECRET: findEnvByKey('DEV_CLIENT_SECRET'),
      DEV_REDIRECT_URI: findEnvByKey('DEV_REDIRECT_URI'),
      LOCAL_ID: findEnvByKey('LOCAL_CLIENT_ID'),
      LOCAL_SECRET: findEnvByKey('LOCAL_CLIENT_SECRET'),
      LOCAL_REDIRECT_URI: findEnvByKey('LOCAL_REDIRECT_URI'),
      INTRA_TOKEN_URL: findEnvByKey('INTRA_TOKEN_URL'),
      INTRA_ME_URL: findEnvByKey('INTRA_ME_URL'),
    } satisfies FtClientConfig),
);
