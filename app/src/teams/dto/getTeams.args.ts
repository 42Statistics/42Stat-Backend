import { ArgsType, Field, InputType, registerEnumType } from '@nestjs/graphql';
import { DateRangeInput } from 'src/baseArgs/dateRangeInput';
import { NumericInput } from 'src/baseArgs/numericInput';
import { PaginationArgs } from 'src/baseArgs/pagenation.args';
import { SortOrderInput } from 'src/baseArgs/sortInput';

export enum GetTeamsSortKey {
  FINAL_MARK = 'finalMark',
}

registerEnumType(GetTeamsSortKey, {
  name: 'GetTeamsSortKey',
});

@InputType()
export class GetTeamsSort extends SortOrderInput {
  @Field((_type) => GetTeamsSortKey)
  key: GetTeamsSortKey;
}

// todo: InputType을 이용하면 filter: { ... } 형태로 보낼 수 있지만, filter의 종류가 많지 않다면 오히려 타입만 늘어나는 결과일지도.
// 그냥 ArgsType의 Field로 넣는게 filter의 종류가 적은 경우엔 더 효율적인 듯 하다.
@InputType()
class GetTeamsFilter {
  @Field({ nullable: true })
  isLocked?: boolean;

  @Field({ nullable: true })
  isValidated?: boolean;

  @Field({ nullable: true })
  isMarked?: boolean;
}

@InputType()
class GetTeamsRange {
  @Field((_type) => DateRangeInput, { nullable: true })
  beginAtRange?: DateRangeInput;

  @Field((_type) => NumericInput, { nullable: true })
  finalMarkRange?: NumericInput;
}

@ArgsType()
export class GetTeamsArgs extends PaginationArgs {
  @Field((_type) => GetTeamsFilter, { nullable: true })
  filter?: GetTeamsFilter;

  @Field((_type) => GetTeamsRange, { nullable: true })
  range?: GetTeamsRange;

  @Field((_type) => GetTeamsSort, { nullable: true })
  sort?: GetTeamsSort;
}
