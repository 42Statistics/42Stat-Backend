import { registerAs } from '@nestjs/config';
import { findEnvByKey } from './util/findEnvByKey';

export type TimezoneConfig = {
  TIMEZONE: string;
};

export const TIMEZONE_CONFIG = 'timezone';

export const timezoneConfig = registerAs(
  TIMEZONE_CONFIG,
  () =>
    ({
      TIMEZONE: findEnvByKey('TZ'),
    } satisfies TimezoneConfig),
);
