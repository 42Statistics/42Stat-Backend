import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

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

@ObjectType()
export class UserProfile {
  @Field((_type) => ID)
  id: string;

  @Field()
  login: string;

  @Field()
  name: string;

  @Field()
  imgUrl: string;

  @Field((_type) => [UserTitle], { nullable: 'items' })
  userTitles: UserTitle[];

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
