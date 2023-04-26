import {
  Field,
  Float,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { GraphQLURL } from 'graphql-scalars';
import { Coalition } from 'src/coalition/models/coalition.model';

@ObjectType()
export class UserTitle {
  @Field((_type) => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  isSelected: boolean;
}

@ObjectType()
export class UserScoreInfo {
  @Field()
  value: number;

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
  id: number;

  @Field()
  login: string;

  @Field()
  grade: UserGrade;

  @Field()
  name: string;

  @Field({ nullable: true })
  coalition?: Coalition;

  @Field((_type) => GraphQLURL, { nullable: true })
  imgUrl?: URL;

  @Field((_type) => [UserTitle], { nullable: 'items' })
  titles: UserTitle[];

  @Field((_type) => Float)
  level: number;

  @Field()
  pooledAt: Date;

  @Field({ nullable: true })
  blackholedAt?: Date;

  @Field()
  wallet: number;

  @Field()
  correctionPoint: number;

  @Field()
  scoreInfo: UserScoreInfo;
}
