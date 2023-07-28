import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { ProjectModule } from 'src/api/project/project.module';
import { SerachResultResolver } from './search.resovler';
import { SearchService } from './search.service';

@Module({
  imports: [CursusUserModule, ProjectModule],
  providers: [SerachResultResolver, SearchService],
})
// eslint-disable-next-line
export class SearchModule {}
