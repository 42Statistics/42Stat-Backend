import { registerAs } from '@nestjs/config';

export type ApiConfig = {
  readonly SEOUL_COALITION_ID: number[];
  readonly FT_LOGIN_MAX_LENGTH: number;
};

export const API_CONFIG = 'api';

const FT_LOGIN_MAX_LENGTH = 10;

export const apiConfig = registerAs(
  API_CONFIG,
  () =>
    ({
      SEOUL_COALITION_ID: [85, 86, 87, 88],
      FT_LOGIN_MAX_LENGTH,
    } satisfies ApiConfig),
);
