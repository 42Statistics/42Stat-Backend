import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { LambdaService } from './lambda.service';

@Controller('lambda')
export class LambdaController {
  constructor(private readonly lambdaService: LambdaService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async updatedAt(@Body('timestamp') timestamp?: number) {
    if (!timestamp) {
      throw new BadRequestException();
    }

    this.lambdaService.updatePreloadCache(timestamp);

    return;
  }
}
