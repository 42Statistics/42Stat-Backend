import { Field, ObjectType } from '@nestjs/graphql';
import { ProjectRank } from 'src/page/home/team/models/home.team.model';

@ObjectType({ description: '누적 데이터 기준입니다.' })
export class Landing {
  @Field()
  daysAfterBeginAt: number;

  @Field()
  aliveCount: number;

  @Field()
  blackholedCount: number;

  @Field()
  memberCount: number;

  @Field()
  evalCount: number;

  @Field()
  trendingProject: ProjectRank;
}
