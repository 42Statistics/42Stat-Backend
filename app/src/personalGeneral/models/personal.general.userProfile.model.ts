import { Field, Float, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Coalition } from 'src/coalition/models/coalition.model';

@ObjectType()
export class UserTitle {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  isSelected: boolean;
}

@ObjectType()
export class UserScoreRank {
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
  @Field()
  id: number;

  @Field()
  login: string;

  @Field()
  grade: string;
  //grade: UserGrade;

  @Field()
  name: string;

  @Field()
  coalition: Coalition;

  @Field({ nullable: true })
  imgUrl?: string;

  @Field((_type) => [UserTitle], { nullable: 'items' })
  titles: UserTitle[];

  @Field((_type) => Float)
  level: number;

  @Field()
  beginAt: Date;

  @Field({ nullable: true })
  blackholedAt?: Date;

  @Field()
  wallet: number;

  @Field()
  correctionPoint: number;

  @Field()
  scoreInfo: UserScoreRank;
}
