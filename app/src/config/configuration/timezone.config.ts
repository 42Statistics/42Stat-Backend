import { registerAs } from '@nestjs/config';

export default registerAs('timezone', () => ({
  TIMEZONE: process.env.TZ,
}));
