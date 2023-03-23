import { Query, Resolver } from '@nestjs/graphql';
import { PersonalGeneral } from './models/personal.general.model';

@Resolver((_of: unknown) => PersonalGeneral)
export class PersonalGeneralResolver {
  @Query((_returns) => PersonalGeneral)
  async getPersonGeneralPage() {
    // totalEvalCnt: number;
    // evalDifficulty: number; // todo
    // destinyUsers: DestinyUser[];
    // logtimeInfo: LogtimeInfo;
    // teamInfo: TeamInfo;
    // levelHistory: LevelHisotry[];
  }
}
