import { Field, ObjectType } from '@nestjs/graphql';
import { Promo } from 'src/page/common/models/promo.model';

@ObjectType()
export class LeaderboardMetadata {
  @Field((_type) => [Promo])
  promoList: Promo[];
}
