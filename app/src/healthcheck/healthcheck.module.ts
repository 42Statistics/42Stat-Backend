import { Module } from '@nestjs/common';
import { HealthCheckController } from './healthcheck.controller';

@Module({
  controllers: [HealthCheckController],
})
// eslint-disable-next-line
export class HealthCheckModule {}
