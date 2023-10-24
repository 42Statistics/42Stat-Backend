import { registerAs } from '@nestjs/config';
import { findEnvByKey } from './util/findEnvByKey';

type FtClientConfig = {
  ID: string;
  REDIRECT_URI: string;
  DEV_ID: string;
  DEV_REDIRECT_URI: string;
  LOCAL_ID: string;
  LOCAL_REDIRECT_URI: string;
  INTRA_TOKEN_URL: string;
  INTRA_ME_URL: string;
};

export const FT_CLIENT_CONFIG = registerAs(
  'ftClient',
  () =>
    ({
      ID: findEnvByKey('CLIENT_ID'),
      REDIRECT_URI: findEnvByKey('REDIRECT_URI'),
      DEV_ID: findEnvByKey('DEV_CLIENT_ID'),
      DEV_REDIRECT_URI: findEnvByKey('DEV_REDIRECT_URI'),
      LOCAL_ID: findEnvByKey('LOCAL_CLIENT_ID'),
      LOCAL_REDIRECT_URI: findEnvByKey('LOCAL_REDIRECT_URI'),
      INTRA_TOKEN_URL: findEnvByKey('INTRA_TOKEN_URL'),
      INTRA_ME_URL: findEnvByKey('INTRA_ME_URL'),
    } satisfies FtClientConfig),
);
