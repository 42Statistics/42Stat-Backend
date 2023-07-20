import { registerAs } from '@nestjs/config';

export default registerAs('googleClient', () => ({
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
}));

export type GoogleClientConfig = {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  REDIRECT_URI: string;
};
