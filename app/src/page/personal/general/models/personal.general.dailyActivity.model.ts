import {
  ArgsType,
  Field,
  ObjectType,
  createUnionType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsOptional, Max, Min } from 'class-validator';
import { DailyActivityType } from 'src/dailyActivity/dailyActivity.dto';

registerEnumType(DailyActivityType, {
  name: 'DailyAcitivtyType',
});

@ObjectType()
export class DailyLogtimeRecord {
  @Field((_type) => DailyActivityType)
  type: DailyActivityType.LOGTIME;

  @Field()
  value: number;
}

@ObjectType()
export class DailyDefaultRecord {
  @Field((_type) => DailyActivityType)
  type: Exclude<DailyActivityType, DailyActivityType.LOGTIME>;

  @Field()
  id: number;

  @Field()
  at: Date;
}

const DailyActivityRecordUnion = createUnionType({
  name: 'DailyActivityRecord',
  types: () => [DailyLogtimeRecord, DailyDefaultRecord] as const,
  resolveType: (value) => {
    switch (value.type) {
      case DailyActivityType.LOGTIME:
        return DailyLogtimeRecord;
      default:
        return DailyDefaultRecord;
    }
  },
});

@ObjectType()
export class DailyActivity {
  @Field()
  date: Date;

  @Field((_type) => [DailyActivityRecordUnion])
  records: (typeof DailyActivityRecordUnion)[];
}

@ArgsType()
export class GetDailyActivitiesArgs {
  @IsOptional()
  @Min(2000)
  @Max(2100)
  @Field({ nullable: true })
  year?: number;
}
