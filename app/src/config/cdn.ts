import { registerAs } from '@nestjs/config';
import { findEnvByKey } from './util/findEnvByKey';

type CdnConfig = {
  BASE: string;
  COALITION: string;
};

export const CDN_CONFIG = registerAs('cdn', (): CdnConfig => {
  const BASE = findEnvByKey('CDN_BASE');
  const COALITION = BASE + '/coalitions';

  return {
    BASE,
    COALITION,
  } satisfies CdnConfig;
});
