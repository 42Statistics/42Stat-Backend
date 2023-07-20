import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  SECRET: process.env.JWT_SECRET,
  ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
  REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
}));

export type JwtConfig = {
  SECRET: string;
  ACCESS_EXPIRES: string;
  REFRESH_EXPIRES: string;
};
