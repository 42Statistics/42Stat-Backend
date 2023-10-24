import { registerAs } from '@nestjs/config';
import { findEnvByKey } from './util/findEnvByKey';

type AwsConfig = {
  REGION: string;
  AWS_PROD_FT_CLIENT_SECRET_ID: string;
  AWS_DEV_FT_CLIENT_SECRET_ID: string;
  AWS_LOCAL_FT_CLIENT_SECRET_ID: string;
  AWS_FT_CLIENT_SECRET_KEY: string;
};

const AWS_FT_CLIENT_SECRET_KEY = 'CLIENT_SECRET';

export type AwsFtClientSecret = {
  [AWS_FT_CLIENT_SECRET_KEY]: string;
};

export const AWS_CONFIG = registerAs('aws', (): AwsConfig => {
  return {
    REGION: 'ap-northeast-2',
    AWS_PROD_FT_CLIENT_SECRET_ID: findEnvByKey('AWS_PROD_FT_CLIENT_SECRET_ID'),
    AWS_DEV_FT_CLIENT_SECRET_ID: findEnvByKey('AWS_DEV_FT_CLIENT_SECRET_ID'),
    AWS_LOCAL_FT_CLIENT_SECRET_ID: findEnvByKey(
      'AWS_LOCAL_FT_CLIENT_SECRET_ID',
    ),
    AWS_FT_CLIENT_SECRET_KEY,
  };
});
