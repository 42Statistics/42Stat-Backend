import { Module } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONFIG } from 'src/config/database';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [DATABASE_CONFIG.KEY],
      useFactory: (databaseConfig: ConfigType<typeof DATABASE_CONFIG>) => ({
        uri: databaseConfig.CONNECTION_STRING,
      }),
    }),
  ],
})
// eslint-disable-next-line
export class MongooseRootModule {}
