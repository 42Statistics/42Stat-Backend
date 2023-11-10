import { InternalServerErrorException } from '@nestjs/common';
import {
  ArgsType,
  Field,
  InputType,
  ObjectType,
  createUnionType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
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

@ObjectType()
export class DailyLogtimeDetailRecord {
  @Field((_type) => DailyActivityType)
  type: DailyActivityType.LOGTIME;

  @Field()
  value: number;
}

@ObjectType()
class DailyEventDetailRecord {
  @Field((_type) => DailyActivityType)
  type: DailyActivityType.EVENT;

  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  location: string;

  @Field()
  beginAt: Date;

  @Field()
  endAt: Date;
}

@ObjectType()
class DailyEvaluationDetailRecord {
  @Field((_type) => DailyActivityType)
  type: DailyActivityType.CORRECTED | DailyActivityType.CORRECTOR;

  @Field()
  id: number;

  @Field()
  correctorLogin: string;

  @Field()
  teamId: number;

  @Field()
  leaderLogin: string;

  @Field()
  projectName: string;

  @Field()
  beginAt: Date;

  @Field()
  filledAt: Date;
}

export const DailyActivityDetailRecordUnion = createUnionType({
  name: 'DailyActivityDetailRecord',
  types: () => [DailyEventDetailRecord, DailyEvaluationDetailRecord] as const,
  resolveType: (
    value: DailyEventDetailRecord | DailyEvaluationDetailRecord,
  ) => {
    switch (value.type) {
      case DailyActivityType.EVENT:
        return DailyEventDetailRecord;
      case DailyActivityType.CORRECTED:
      case DailyActivityType.CORRECTOR:
        return DailyEvaluationDetailRecord;
      default:
        throw new InternalServerErrorException('wrong activity detail type');
    }
  },
});

@InputType()
export class DailyActivityDetailRecordIdWithType {
  @Field((_type) => DailyActivityType, {
    description: 'CORRECTOR, CORRECTED, EVENT 만 가능합니다',
  })
  type: DailyActivityType;

  @Field()
  id: number;
}

@ArgsType()
export class GetDailyActivityDetailRecordsArgs {
  @ArrayMaxSize(50)
  @ArrayMinSize(1)
  @Field((_type) => [DailyActivityDetailRecordIdWithType])
  args: DailyActivityDetailRecordIdWithType[];
}
