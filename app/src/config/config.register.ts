import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientConfig } from './configuration/client.config';
import { DatabaseConfig } from './configuration/database.config';
import { GoogleConfig } from './configuration/google.config';
import { JwtConfig } from './configuration/jwt.config';

@Injectable()
export class ConfigRegister implements OnModuleInit {
  private client: ClientConfig;
  private database: DatabaseConfig;
  private google: GoogleConfig;
  private jwt: JwtConfig;
  private timezone: string;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const client = this.configService.get<ClientConfig>('client');
    const database = this.configService.get<DatabaseConfig>('database');
    const google = this.configService.get<GoogleConfig>('google');
    const jwt = this.configService.get<JwtConfig>('jwt');
    const timezone = this.configService.get<string>('timezone');

    if (!client || !database || !google || !jwt || !timezone) {
      throw new InternalServerErrorException(
        'Missing environment configuration',
      );
    }

    this.client = client;
    this.database = database;
    this.google = google;
    this.jwt = jwt;
    this.timezone = timezone;
  }

  getClient(): ClientConfig {
    return this.client;
  }

  getDatabase(): DatabaseConfig {
    return this.database;
  }

  getGoogle(): GoogleConfig {
    return this.google;
  }

  getJwt(): JwtConfig {
    return this.jwt;
  }

  getTimezone(): string {
    return this.timezone;
  }
}
