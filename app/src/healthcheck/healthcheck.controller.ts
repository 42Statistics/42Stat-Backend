import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('healthcheck')
export class HealthCheckController {
  @Get()
  @HttpCode(HttpStatus.OK)
  healthCheck() {}
}
