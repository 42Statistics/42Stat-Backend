import { Field, Float, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Coalition } from 'src/api/coalition/models/coalition.model';

@ObjectType()
export class UserTitle {
  @Field()
  titleId: number;

  @Field()
  name: string;

  @Field()
  selected: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
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

  @Field({ nullable: true })
  imgUrl?: string;

  @Field()
  grade: string;
  //grade: UserGrade;

  @Field()
  displayname: string;

  @Field()
  coalition: Coalition;

  @Field((_type) => [UserTitle], { nullable: 'items' })
  titles: UserTitle[];

  @Field((_type) => Float)
  level: number;
}
