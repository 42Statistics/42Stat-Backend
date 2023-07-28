import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { ProjectPreview } from 'src/common/models/common.project.model';
import { Rate } from 'src/common/models/common.rate.model';
import { DateRanged } from 'src/dateRange/models/dateRange.model';

@ObjectType()
export class ProjectRank {
  @Field()
  projectPreview: ProjectPreview;

  @Field()
  value: number;

  @Field()
  rank: number;
}

@ObjectType()
export class ResultPerRank {
  @Field()
  rank: number;

  @Field()
  rate: Rate;
}

@ObjectType()
export class ExamResult {
  @Field((_type) => [ResultPerRank])
  resultPerRank: ResultPerRank[];

  @Field()
  beginAt: Date;

  @Field()
  endAt: Date;

  @Field()
  location: string;

  @Field()
  maxPeople: number;

  @Field()
  name: string;

  @Field()
  nbrSubscribers: number;
}

@ObjectType()
export class ExamResultDateRanged extends DateRanged(ExamResult) {}

@ObjectType()
export class HomeTeam {
  @Field((_type) => [ProjectRank])
  currRegisteredCountRanking: ProjectRank[];

  @Field()
  recentExamResult: ExamResultDateRanged;
}

@ArgsType()
export class RecentExamResultInput {
  @Min(0)
  @Field({ defaultValue: 0 })
  after: number;
}
