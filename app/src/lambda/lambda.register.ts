import { Injectable, OnModuleInit } from '@nestjs/common';
import { LambdaService } from './lambda.service';
import { StatDate } from 'src/statDate/StatDate';

@Injectable()
export class LambdaRegister implements OnModuleInit {
  constructor(private lambdaService: LambdaService) {}

  async onModuleInit(): Promise<void> {
    await this.lambdaService.updatePreloadCache(StatDate.currWeek().getTime());
  }
}
