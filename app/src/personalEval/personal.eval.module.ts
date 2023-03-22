import { Module } from '@nestjs/common';
import { PersonalEvalResolver } from './personal.eval.resolver';

@Module({
  imports: [],
  providers: [PersonalEvalResolver],
})
export class PersonalEvalModule {}
