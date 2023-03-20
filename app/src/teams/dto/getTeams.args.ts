import { ArgsType, Field, InputType, registerEnumType } from '@nestjs/graphql';
import { DateRangeInput } from 'src/baseArgs/dateRangeInput';
import { NumericInput } from 'src/baseArgs/numericInput';
import { SortOrderInput } from 'src/baseArgs/sortInput';
import { PaginationArgs } from 'src/pagination/pagination.args';

@InputType()
export class GetTeamsFilter {
  @Field((_type) => Boolean, { nullable: true })
  isLocked: boolean | null;

  @Field((_type) => Boolean, { nullable: true })
  isValidated: boolean | null;

  @Field((_type) => Boolean, { nullable: true })
  isMarked: boolean | null;
}

@InputType()
export class GetTeamsRange {
  @Field((_type) => DateRangeInput, { nullable: true })
  beginAtRange: DateRangeInput | null;

  @Field((_type) => NumericInput, { nullable: true })
  finalMarkRange: NumericInput | null;
}

export enum GetTeamsSortKey {
  FINAL_MARK,
}

registerEnumType(GetTeamsSortKey, {
  name: 'GetTeamsSortKey',
});

@InputType()
export class GetTeamsSort extends SortOrderInput {
  @Field((_type) => GetTeamsSortKey)
  key: GetTeamsSortKey;
}

@ArgsType()
export class GetTeamsArgs extends PaginationArgs {
  @Field((_type) => GetTeamsFilter, { nullable: true })
  filter: GetTeamsFilter | null;

  @Field((_type) => GetTeamsRange, { nullable: true })
  range: GetTeamsRange | null;

  @Field((_type) => GetTeamsSort, { nullable: true })
  sort: GetTeamsSort | null;
}
