import { registerAs } from '@nestjs/config';
import { findEnvByKey } from './util/findEnvByKey';

type JwtConfig = {
  SECRET: string;
  ACCESS_EXPIRES: string;
  REFRESH_EXPIRES: string;
};

export const JWT_CONFIG = registerAs(
  'jwt',
  () =>
    ({
      SECRET: findEnvByKey('JWT_SECRET'),
      ACCESS_EXPIRES: findEnvByKey('JWT_ACCESS_EXPIRES'),
      REFRESH_EXPIRES: findEnvByKey('JWT_REFRESH_EXPIRES'),
    } satisfies JwtConfig),
);
