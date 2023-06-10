import { Field, ObjectType } from '@nestjs/graphql';

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
}
