import {
  ArgsType,
  Field,
  InputType,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { DateRangeInput } from 'src/baseArgs/dateRangeInput';
import { NumericInput } from 'src/baseArgs/numericInput';
import { SortOrderInput } from 'src/baseArgs/sortInput';
import { PaginationArgs } from 'src/pagination/pagination.args';

@InputType()
export class GetScaleTeamsFilter {
  @Field((_type) => Int, { nullable: true })
  userId: number | null;

  @Field((_type) => Date, { nullable: true })
  createdAt: Date | null;

  @Field((_type) => Date, { nullable: true })
  beginAt: Date | null;

  @Field((_type) => Int, { nullable: true })
  finalMark: number | null;

  @Field((_type) => Boolean, { nullable: true })
  isFilled: boolean | null;
}

@InputType()
export class GetScaleTeamsRange {
  @Field((_type) => DateRangeInput, { nullable: true })
  createdAtRange: DateRangeInput | null;

  @Field((_type) => DateRangeInput, { nullable: true })
  beginAtRange: DateRangeInput | null;

  @Field((_type) => NumericInput, { nullable: true })
  finalMarkRange: NumericInput | null;
}

export enum GetScaleTeamsSortKey {
  FINAL_MARK,
  CORRECTOR_ID,
  CORRECTEDS_LEADER_ID,
  CREATED_AT,
  BEGIN_AT,
  TEAM_ID,
}

registerEnumType(GetScaleTeamsSortKey, {
  name: 'GetScaleTeamsSortKey',
});

@InputType()
export class GetScaleTeamsSort extends SortOrderInput {
  @Field((_type) => GetScaleTeamsSortKey)
  key: GetScaleTeamsSortKey;
}

@ArgsType()
export class GetScaleTeamsArgs extends PaginationArgs {
  @Field((_type) => GetScaleTeamsFilter, { nullable: true })
  filter: GetScaleTeamsFilter | null;

  @Field((_type) => GetScaleTeamsRange, { nullable: true })
  range: GetScaleTeamsRange | null;

  @Field((_type) => GetScaleTeamsSort, { nullable: true })
  sort: GetScaleTeamsSort | null;
}
