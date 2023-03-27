import { Module } from '@nestjs/common';
import { PersonalGeneralModule } from 'src/personalGeneral/personal.general.module';
import { PersonalGeneralService } from 'src/personalGeneral/personal.general.service';
import { PersonalEvalResolver } from './personal.eval.resolver';
import { PersonalEvalService } from './personal.eval.service';

@Module({
  imports: [PersonalGeneralModule],
  providers: [PersonalEvalResolver, PersonalEvalService, PersonalGeneralService],
})
export class PersonalEvalModule {}
