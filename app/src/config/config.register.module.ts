import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigRegister } from './config.register';

@Module({
  imports: [ConfigModule],
  providers: [ConfigService, ConfigRegister],
})
// eslint-disable-next-line
export class ConfigRegisterModule {}
