import { Module } from '@nestjs/common';
import { PersonalEvalModule } from './eval/personal.eval.module';
import { PersonalGeneralModule } from './general/personal.general.module';
import { PersonalVersusModule } from './versus/personal.versus.module';

@Module({
  imports: [PersonalGeneralModule, PersonalEvalModule, PersonalVersusModule],
})
// eslint-disable-next-line
export class PersonalModule {}
