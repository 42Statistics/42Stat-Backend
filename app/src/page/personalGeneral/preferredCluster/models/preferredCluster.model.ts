import { Field, ObjectType } from '@nestjs/graphql';
import { StringDateRanged } from 'src/common/models/common.number.dateRanaged';

@ObjectType()
export class PreferredCluster {
  @Field()
  total: string;

  @Field()
  byDateRange: StringDateRanged;

  @Field()
  byDateTemplate: StringDateRanged;
}
