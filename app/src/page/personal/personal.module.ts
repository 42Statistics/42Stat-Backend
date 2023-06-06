import { Module } from '@nestjs/common';
import { PersonalEvalModule } from './eval/personal.eval.module';
import { PersonalGeneralModule } from './general/personal.general.module';

@Module({
  imports: [PersonalGeneralModule, PersonalEvalModule],
})
// eslint-disable-next-line
export class PersonalModule {}
