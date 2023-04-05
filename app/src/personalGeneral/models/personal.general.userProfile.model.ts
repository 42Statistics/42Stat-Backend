import { Field, Float, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { URLResolver } from 'graphql-scalars';
import { Coalition } from 'src/common/models/common.coalition.model';

@ObjectType()
export class UserTitle {
  @Field((_type) => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  isSelected: boolean;
}

@ObjectType()
export class ScoreInfo {
  @Field()
  current: number;

  @Field()
  rankInCoalition: number;

  @Field()
  rankInTotal: number;
}

export enum UserGrade {
  LEARNER = 'learner',
  MEMBER = 'member',
}

registerEnumType(UserGrade, {
  name: 'UserGrade',
});

@ObjectType()
export class UserProfile {
  @Field((_type) => ID)
  id: string;

  @Field()
  login: string;

  @Field((_type) => UserGrade)
  grade: UserGrade;

  @Field()
  name: string;

  @Field((_type) => Coalition, { nullable: true })
  coalition: Coalition | null;

  @Field((_type) => URLResolver, { nullable: true })
  imgUrl: string | null;

  @Field((_type) => [UserTitle], { nullable: 'items' })
  titles: UserTitle[];

  @Field((_type) => Float)
  level: number;

  @Field()
  pooledAt: Date;

  @Field((_type) => Date, { nullable: true })
  blackholedAt: Date | null;

  @Field()
  wallet: number;

  @Field()
  correctionPoint: number;

  @Field()
  scoreInfo: ScoreInfo;
}
