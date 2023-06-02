import { Field, ObjectType } from '@nestjs/graphql';
import {
  PreferredTimeElement,
  PreferredTimeElementDateRanged,
} from '../../models/personal.general.model';

@ObjectType()
export class PreferredTime {
  @Field()
  total: PreferredTimeElement;

  @Field()
  byDateRange: PreferredTimeElementDateRanged;

  @Field()
  byDateTemplate: PreferredTimeElementDateRanged;
}
