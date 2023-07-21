import { Injectable, OnModuleInit } from '@nestjs/common';
import { StatDate } from 'src/statDate/StatDate';
import { LambdaService } from './lambda.service';

@Injectable()
export class LambdaRegister implements OnModuleInit {
  constructor(private readonly lambdaService: LambdaService) {}

  async onModuleInit(): Promise<void> {
    await this.lambdaService.updatePreloadCache(StatDate.currWeek().getTime());
  }
}
