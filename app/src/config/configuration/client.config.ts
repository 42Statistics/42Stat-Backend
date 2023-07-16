import { registerAs } from "@nestjs/config";

export default registerAs('client', () => ({
  ID: process.env.CLIENT_ID,
  SECRET: process.env.CLIENT_SECRET,
  REDIRECT_URI: process.env.REDIRECT_URI,
  INTRA_TOKEN_URI: process.env.INTRA_TOKEN_URI,
  INTRA_ME_URI: process.env.INTRA_ME_URI,
}))

export interface ClientConfig {
  ID: string;
  SECRET: string;
  REDIRECT_URI: string;
  INTRA_TOKEN_URI: string;
  INTRA_ME_URI: string;
}
