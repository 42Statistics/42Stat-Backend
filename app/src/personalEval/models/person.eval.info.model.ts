import { Field, ID, ObjectType } from '@nestjs/graphql';
import { URLResolver } from 'graphql-scalars';
import { Paginated } from 'src/pagination/pagination.type';

// todo remove this
@ObjectType()
export class UserPreview {
  @Field((_type) => ID)
  id: string;

  @Field()
  login: string;

  @Field((_type) => URLResolver, { nullable: true })
  imgUrl: string | null;
}

@ObjectType()
export class ProjectPreview {
  @Field((_type) => ID)
  id: string;

  @Field()
  name: string;

  @Field((_type) => URLResolver)
  url: string;
}

@ObjectType()
export class TeamPreview {
  @Field((_type) => ID)
  id: string;

  @Field()
  name: string;

  @Field((_type) => URLResolver)
  url: string;
}

// till here

@ObjectType()
export class Corrector extends UserPreview {
  @Field()
  comment: string;

  @Field({
    description: '피평가자가 평가자에게 5점 만점 중 몇 점을 주었는가 입니다.',
  })
  correctorRate: number;
}

@ObjectType()
export class Corrected extends UserPreview {
  @Field()
  isLeader: boolean;

  @Field()
  feedback: string;
}

@ObjectType()
export class Flag {
  @Field((_type) => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  isPositive: boolean;
}

@ObjectType()
export class EvalInfo {
  @Field((_type) => Corrector)
  corrector: Corrector;

  @Field((_type) => [Corrected])
  correcteds: Corrected[];

  @Field()
  beginAt: Date;

  @Field()
  finalMark: number;

  @Field((_type) => Flag)
  flag: Flag;

  @Field()
  projectPreview: ProjectPreview; // todo subject

  @Field()
  teamPreview: TeamPreview; // todo team
}

@ObjectType()
export class EvalInfoPaginated extends Paginated(EvalInfo) {}
