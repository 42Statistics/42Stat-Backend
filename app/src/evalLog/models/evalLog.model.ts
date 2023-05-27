import { Field, ID, ObjectType } from '@nestjs/graphql';
import { URLResolver } from 'graphql-scalars';
import { UserPreview } from 'src/common/models/common.user.model';
import { Paginated } from 'src/pagination/models/pagination.model';
import { ProjectPreview } from 'src/api/project/models/project.preview';

@ObjectType()
export class TeamPreview {
  @Field((_type) => ID)
  id: number;

  @Field()
  name: string;

  @Field((_type) => URLResolver)
  url: string;
}

@ObjectType()
export class Flag {
  @Field((_type) => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  isPositive: boolean;
}

@ObjectType()
export class EvalLogHeader {
  @Field()
  corrector: UserPreview;

  @Field()
  teamPreview: TeamPreview;

  @Field()
  beginAt: Date;

  @Field()
  projectPreview: ProjectPreview;

  @Field()
  flag: Flag;
}

@ObjectType()
export class EvalReview {
  @Field()
  mark: number;

  @Field()
  review: string;
}

@ObjectType()
export class EvalLog {
  @Field()
  header: EvalLogHeader;

  @Field({ description: '평가자가 부여한 점수와 리뷰 입니다.' })
  correctorReview: EvalReview;

  @Field({ description: '피평가자가 부여한 점수와 리뷰 입니다.' })
  correctedsReview: EvalReview;
}

@ObjectType()
export class EvalLogsPaginated extends Paginated(EvalLog) {}
