import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { ProjectModule } from 'src/api/project/project.module';
import { RegexFindService } from './regexFind.service';

@Module({
  imports: [CursusUserModule, ProjectModule],
  providers: [RegexFindService],
  exports: [CursusUserModule, ProjectModule, RegexFindService],
})
// eslint-disable-next-line
export class RegexFindModule {}
