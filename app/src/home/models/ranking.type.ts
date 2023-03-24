import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { URLResolver } from 'graphql-scalars';

@ObjectType()
export class BaseRankingType {
  @Field((_type) => Int)
  rank: number;

  @Field()
  user: string;

  @Field((_type) => URLResolver)
  profileUrl: string;
}

@ObjectType()
export class RankingType extends BaseRankingType {
  @Field((_type) => Int)
  value: number;
}

@ObjectType()
export class LevelRankingType extends BaseRankingType {
  @Field((_type) => Float)
  value: number;
}

@ObjectType()
export class ProjectRankingType {
  @Field((_type) => Int)
  rank: number;

  @Field()
  subject: string;

  @Field((_type) => Int)
  count: number;
}
