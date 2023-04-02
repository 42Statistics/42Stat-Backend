import { Controller, Post, Body, Get } from '@nestjs/common';
import { EvalLog } from './evalLog.database.schema';
import { EvalLogService } from './evalLog.service';

@Controller('eval-logs')
export class EvalLogController {
  constructor(private readonly evalLogService: EvalLogService) {}

  @Get()
  async testMethod() {
    console.log('get');
  }

  @Post()
  async create(@Body() evalLogData: EvalLog): Promise<EvalLog> {
    //return await this.evalLogService.create(evalLogData);
    return await this.evalLogService.create();
  }
}
