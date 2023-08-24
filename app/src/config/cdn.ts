import { registerAs } from '@nestjs/config';
import { findEnvByKey } from './util/findEnvByKey';

export type CdnConfig = {
  BASE: string;
  COALITION: string;
  PDF: string;
};

export const CDN_CONFIG = 'cdn';

export const cdnConfig = registerAs(CDN_CONFIG, (): CdnConfig => {
  const BASE = findEnvByKey('CDN_BASE');
  const COALITION = BASE + '/coalitions';
  const PDF = BASE + '/pdfs';

  return {
    BASE,
    COALITION,
    PDF,
  };
});
