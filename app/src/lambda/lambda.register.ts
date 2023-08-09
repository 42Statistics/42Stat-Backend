import { Injectable, OnModuleInit } from '@nestjs/common';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import { LambdaService } from './lambda.service';

@Injectable()
export class LambdaRegister implements OnModuleInit {
  constructor(private readonly lambdaService: LambdaService) {}

  async onModuleInit(): Promise<void> {
    await this.lambdaService.updatePreloadCache(
      DateWrapper.currWeek().toDate().getTime(),
    );
  }
}
