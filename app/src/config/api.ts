import { registerAs } from '@nestjs/config';

export type ApiConfig = {
  SEOUL_COALITION_ID: number[];
};

export const API_CONFIG = 'api';

export const apiConfig = registerAs(
  API_CONFIG,
  () =>
    ({
      SEOUL_COALITION_ID: [85, 86, 87, 88],
    } satisfies ApiConfig),
);
