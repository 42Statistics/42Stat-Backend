import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { PersonalUtilService } from './personal.util.service';

@Module({
  imports: [CursusUserModule],
  providers: [PersonalUtilService, CursusUserService],
  exports: [PersonalUtilService],
})
// eslint-disable-next-line
export class PersonalUtilModule {}
