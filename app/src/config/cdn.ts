import { registerAs } from '@nestjs/config';
import { findEnvByKey } from './util/findEnvByKey';

export type CdnConfig = {
  BASE: string;
  COALITION: string;
};

export const CDN_CONFIG = 'cdn';

export const cdnConfig = registerAs(CDN_CONFIG, (): CdnConfig => {
  const BASE = findEnvByKey('CDN_BASE');
  const COALITION = BASE + '/coalitions';

  return {
    BASE,
    COALITION,
  };
});
