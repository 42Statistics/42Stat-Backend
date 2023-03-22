import { Module } from '@nestjs/common';
import { PersonalEvalResolver } from './personal.eval.resolver';
import { PersonalEvalService } from './personal.eval.service';

@Module({
  imports: [],
  providers: [PersonalEvalResolver, PersonalEvalService],
})
export class PersonalEvalModule {}
