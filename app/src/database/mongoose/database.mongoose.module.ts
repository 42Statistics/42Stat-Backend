import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONFIG, DatabaseConfig } from 'src/config/database';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow<DatabaseConfig>(DATABASE_CONFIG)
          .CONNECTION_STRING,
      }),
      inject: [ConfigService],
    }),
  ],
})
// eslint-disable-next-line
export class MongooseRootModule {}
