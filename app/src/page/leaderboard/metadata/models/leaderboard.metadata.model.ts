import { Field, ObjectType } from '@nestjs/graphql';
import { Coalition } from 'src/page/common/models/coalition.model';
import { Promo } from 'src/page/common/models/promo.model';

@ObjectType()
export class LeaderboardMetadata {
  @Field((_type) => [Promo])
  promoList: Promo[];

  @Field((_type) => [Coalition])
  coalitionList: Coalition[];
}
