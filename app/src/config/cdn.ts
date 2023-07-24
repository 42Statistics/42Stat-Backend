import { registerAs } from '@nestjs/config';
import { findEnvByKey } from './util/findEnvByKey';

export type CdnConfig = {
  URL: string;
};

export const CDN_CONFIG = 'cdn';

export const cdnConfig = registerAs(
  CDN_CONFIG,
  () =>
    ({
      URL: findEnvByKey('CDN_URL'),
    } satisfies CdnConfig),
);
