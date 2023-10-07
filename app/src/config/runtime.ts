import { registerAs } from '@nestjs/config';
import { findEnvByKey } from './util/findEnvByKey';

type RuntimeConfig = {
  PROD: boolean;
  DEV: boolean;
  LOCAL: boolean;
  TIMEZONE: string;
  PORT: number;
};

export const RUNTIME_CONFIG_KEY = 'runtime';

export const RUNTIME_CONFIG = registerAs(RUNTIME_CONFIG_KEY, () => {
  let PROD: boolean;

  try {
    PROD = findEnvByKey('PROD') === 'true';
  } catch {
    PROD = false;
  }

  let DEV: boolean;

  try {
    DEV = findEnvByKey('DEV') === 'true';
  } catch {
    DEV = false;
  }

  let LOCAL: boolean;

  try {
    LOCAL = findEnvByKey('LOCAL') === 'true';
  } catch {
    LOCAL = false;
  }

  const PORT = parseInt(findEnvByKey('PORT'));
  if (isNaN(PORT)) {
    throw Error(`Wrong PORT value: ${PORT}`);
  }

  return {
    PROD,
    DEV,
    LOCAL,
    TIMEZONE: findEnvByKey('TZ'),
    PORT,
  } satisfies RuntimeConfig;
});
