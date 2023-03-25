import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { URLResolver } from 'graphql-scalars';

@ObjectType()
export class BaseRanking {
  @Field((_type) => Int)
  rank: number;

  @Field((_type) => Float)
  value: number;
}

@ObjectType()
export class Ranking extends BaseRanking {
  @Field()
  userName: string; //todo: User { name, profileUrl }

  @Field((_type) => URLResolver)
  profileUrl: string;
}

@ObjectType()
export class ProjectRanking extends BaseRanking {
  @Field()
  projectName: string;
}
