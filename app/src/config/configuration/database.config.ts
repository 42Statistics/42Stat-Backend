import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
  USERNAME: process.env.DB_USERNAME,
  PASSWORD: process.env.DB_PASSWORD,
  ENDPOINT: process.env.DB_ENDPOINT,
  NAME: process.env.DB_NAME,
}))

export interface DatabaseConfig {
  USERNAME: string;
  PASSWORD: string;
  ENDPOINT: string;
  NAME: string;
}
