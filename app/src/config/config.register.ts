import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from './configuration/database.config';
import { FtClientConfig } from './configuration/ftClient.config';
import { GoogleClientConfig } from './configuration/googleClient.config';
import { JwtConfig } from './configuration/jwt.config';

@Injectable()
export class ConfigRegister implements OnModuleInit {
  private ftClient: FtClientConfig;
  private database: DatabaseConfig;
  private googleClient: GoogleClientConfig;
  private jwt: JwtConfig;
  private timezone: string;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const ftClient = this.configService.get<FtClientConfig>('ftClient');
    const database = this.configService.get<DatabaseConfig>('database');
    const googleClient =
      this.configService.get<GoogleClientConfig>('googleClient');
    const jwt = this.configService.get<JwtConfig>('jwt');
    const timezone = this.configService.get<string>('timezone');

    if (!ftClient || !database || !googleClient || !jwt || !timezone) {
      throw new InternalServerErrorException(
        'Missing environment configuration',
      );
    }

    this.ftClient = ftClient;
    this.database = database;
    this.googleClient = googleClient;
    this.jwt = jwt;
    this.timezone = timezone;
  }

  getFtClient(): FtClientConfig {
    return this.ftClient;
  }

  getDatabase(): DatabaseConfig {
    return this.database;
  }

  getGoogleClient(): GoogleClientConfig {
    return this.googleClient;
  }

  getJwt(): JwtConfig {
    return this.jwt;
  }

  getTimezone(): string {
    return this.timezone;
  }
}
