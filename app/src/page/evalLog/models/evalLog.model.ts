import { Field, ObjectType } from '@nestjs/graphql';
import { ProjectPreview } from 'src/common/models/common.project.model';
import { UserPreview } from 'src/common/models/common.user.model';
import { CursorPaginated } from 'src/pagination/cursor/models/pagination.cursor.model';

@ObjectType()
export class TeamPreview {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  url: string;
}

@ObjectType()
export class Flag {
  @Field()
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
  id: number;

  @Field()
  header: EvalLogHeader;

  @Field()
  correctorReview: EvalReview;

  @Field({ nullable: true })
  correctedsReview?: EvalReview;
}

@ObjectType()
export class EvalLogsPaginated extends CursorPaginated(EvalLog) {}
