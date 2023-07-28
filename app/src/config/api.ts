import { registerAs } from '@nestjs/config';
import type { ProjectPreview } from 'src/common/models/common.project.model';

export type ApiConfig = {
  readonly SEOUL_COALITION_ID: number[];
  readonly FT_LOGIN_MAX_LENGTH: number;
  readonly SEOUL_CAMPUS_ID: number;
  readonly PROJECT_BASE_URL: string;
  readonly NETWHAT_PREVIEW: ProjectPreview;
};

export const API_CONFIG = 'api';

export const SEOUL_COALITION_ID = [85, 86, 87, 88];
export const SEOUL_CAMPUS_ID = 29;
export const FT_LOGIN_MAX_LENGTH = 10;
export const PROJECT_BASE_URL = 'https://projects.intra.42.fr/projects';

export const projectUrlById = (id: number): string =>
  [PROJECT_BASE_URL, id.toString()].join('/');

export const NETWHAT_PREVIEW = {
  id: 1318,
  name: 'netwhat',
  url: projectUrlById(1318),
};

export const apiConfig = registerAs(
  API_CONFIG,
  () =>
    ({
      SEOUL_COALITION_ID,
      FT_LOGIN_MAX_LENGTH,
      SEOUL_CAMPUS_ID,
      PROJECT_BASE_URL,
      NETWHAT_PREVIEW,
    } satisfies ApiConfig),
);
