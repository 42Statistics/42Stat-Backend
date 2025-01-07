import { registerAs } from '@nestjs/config';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import { findEnvByKey } from './util/findEnvByKey';

type AwsConfig = {
  REGION: string;
  CREDENTIAL_TIMEOUT: number;
  CREDENTIAL_RETRY_COUNT: number;
  AWS_PROD_FT_CLIENT_SECRET_ID: string;
  AWS_DEV_FT_CLIENT_SECRET_ID: string;
  AWS_FT_CLIENT_SECRET_KEY: string;
};

const AWS_FT_CLIENT_SECRET_KEY = 'CLIENT_SECRET';

export type AwsFtClientSecret = {
  [AWS_FT_CLIENT_SECRET_KEY]: string;
};

export const AWS_CONFIG = registerAs('aws', (): AwsConfig => {
  return {
    REGION: 'ap-northeast-2',
    CREDENTIAL_TIMEOUT: DateWrapper.MIN * 5,
    CREDENTIAL_RETRY_COUNT: 1,
    AWS_PROD_FT_CLIENT_SECRET_ID: findEnvByKey('AWS_PROD_FT_CLIENT_SECRET_ID'),
    AWS_DEV_FT_CLIENT_SECRET_ID: findEnvByKey('AWS_DEV_FT_CLIENT_SECRET_ID'),
    AWS_FT_CLIENT_SECRET_KEY,
  };
});
