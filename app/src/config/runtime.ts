import { registerAs } from '@nestjs/config';
import { findEnvByKey } from './util/findEnvByKey';

type RuntimeConfig = {
  PROD: boolean;
  DEV: boolean;
  TIMEZONE: string;
  PORT: number;
};

export const RUNTIME_CONFIG = registerAs('runtime', () => {
  let PROD: boolean;

  try {
    PROD = findEnvByKey('PROD') === 'true';
  } catch {
    PROD = false;
  }

  const PORT = parseInt(findEnvByKey('PORT'));
  if (isNaN(PORT)) {
    throw Error(`Wrong PORT value: ${PORT}`);
  }

  return {
    PROD,
    DEV: !PROD,
    TIMEZONE: findEnvByKey('TZ'),
    PORT,
  } satisfies RuntimeConfig;
});
