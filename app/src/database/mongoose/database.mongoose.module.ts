import { Module } from '@nestjs/common';
import { ConfigService, type ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { type DATABASE_CONFIG, DATABASE_CONFIG_KEY } from 'src/config/database';
import { type RUNTIME_CONFIG, RUNTIME_CONFIG_KEY } from 'src/config/runtime';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseConfig =
          configService.getOrThrow<ConfigType<typeof DATABASE_CONFIG>>(
            DATABASE_CONFIG_KEY,
          );

        const runtimeConfig =
          configService.getOrThrow<ConfigType<typeof RUNTIME_CONFIG>>(
            RUNTIME_CONFIG_KEY,
          );

        let uri: string;

        if (runtimeConfig.PROD) {
          uri = databaseConfig.CONNECTION_STRING;
        } else if (runtimeConfig.DEV) {
          uri = databaseConfig.DEV_CONNECTION_STRING;
        } else if (runtimeConfig.LOCAL) {
          uri = databaseConfig.LOCAL_CONNECTION_STRING;
        } else {
          throw Error('Wrong env');
        }

        return {
          uri,
        };
      },
    }),
  ],
})
// eslint-disable-next-line
export class MongooseRootModule {}
