import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

export enum GraphInterval {
  DAY,
  WEEK,
  MONTH,
  YEAR,
}

registerEnumType(GraphInterval, {
  name: 'GraphInterval',
});

// Pagination api와 비슷한 이름 유지
@InputType()
export class GraphArgsPeriodic {
  @Field((_type) => Int, {
    nullable: true,
    description: 'graph의 결과를 해당 값 만큼 반환합니다.',
  })
  first: number | null;

  @Field((_type) => Date, {
    nullable: true,
    description:
      'graph의 결과를 해당 날짜의 값을 배열의 시작점으로 반환합니다.',
  })
  after: Date | null;

  @Field((_type) => GraphInterval, { defaultValue: GraphInterval.MONTH })
  interval: GraphInterval;
}

@ObjectType()
export class GraphResultPeriodic {
  @Field()
  first: number;

  @Field()
  after: Date;

  @Field((_type) => [Int], { nullable: 'items' })
  value: number[];
}
