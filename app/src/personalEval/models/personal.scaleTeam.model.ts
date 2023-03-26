import { Field, ID, ObjectType } from '@nestjs/graphql';
import { URLResolver } from 'graphql-scalars';
import { ProjectPreview, UserPreview } from 'src/home/models/ranking.type';
import { Paginated } from 'src/pagination/pagination.type';

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
export class PersonalScaleTeam {
  @Field()
  corrector: Corrector;

  // @Field((_type) => [Corrected])
  // correcteds: Corrected[];

  @Field({ description: '피평가자의 피드백 입니다.' })
  feedback: string;

  @Field()
  beginAt: Date;

  @Field()
  finalMark: number;

  @Field((_type) => Flag)
  flag: Flag;

  @Field()
  projectPreview: ProjectPreview;

  @Field()
  teamPreview: TeamPreview; // todo team
}

@ObjectType()
export class PersonalScaleTeamsPaginated extends Paginated(PersonalScaleTeam) {}
