import { Module } from '@nestjs/common';
import { PersonalGeneralModule } from 'src/personalGeneral/personal.general.module';
import { PersonalGeneralService } from 'src/personalGeneral/personal.general.service';
import { ScaleTeamModule } from 'src/scaleTeam/scaleTeam.module';
import { ScaleTeamService } from 'src/scaleTeam/scaleTeam.service';
import { PersonalEvalResolver } from './personal.eval.resolver';
import { PersonalEvalService } from './personal.eval.service';

@Module({
  imports: [PersonalGeneralModule, ScaleTeamModule],
  providers: [
    PersonalEvalResolver,
    PersonalEvalService,
    PersonalGeneralService,
    ScaleTeamService,
  ],
})
// eslint-disable-next-line
export class PersonalEvalModule {}
