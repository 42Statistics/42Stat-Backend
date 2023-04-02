import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Languages {
  @Field()
  id: number;
  @Field()
  name: string;
  @Field()
  identifier: string;
  @Field()
  created_at: string;
  @Field()
  updated_at: string;
}

@ObjectType()
export class Flag1 {
  @Field()
  id: number;
  @Field()
  name: string;
  @Field()
  positive: boolean;
  @Field()
  icon: string;
  @Field()
  created_at: string;
  @Field()
  updated_at: string;
}

@ObjectType()
export class Scale {
  @Field()
  id: number;
  @Field()
  evaluation_id: number;
  @Field()
  name: string;
  @Field()
  is_primary: boolean;
  @Field()
  comment: string;
  @Field()
  introduction_md: string;
  @Field()
  disclaimer_md: string;
  @Field()
  guidelines_md: string;
  @Field()
  created_at: string;
  @Field()
  correction_number: number;
  @Field()
  duration: number;
  @Field()
  manual_subscription: boolean;
  @Field((_type) => [Languages])
  languages: Languages[];
  @Field((_type) => [Flag1])
  flags: Flag1[];
  @Field()
  free: boolean;
}

@ObjectType()
export class TeamUser {
  @Field()
  id: number;
  @Field()
  login: string;
  @Field()
  url: string;
  @Field()
  leader: boolean;
  @Field()
  occurrence: number;
  @Field()
  validated: boolean;
  @Field()
  projects_user_id: number;
}

@ObjectType()
export class Team {
  @Field()
  id: number;
  @Field()
  name: string;
  @Field()
  url: string;
  @Field((_type) => Int, { nullable: true })
  final_mark: number | null;
  @Field()
  project_id: number;
  @Field()
  created_at: string;
  @Field()
  updated_at: string;
  @Field()
  status: string;
  @Field((_type) => String, { nullable: true })
  terminating_at: string | null;
  @Field((_type) => [TeamUser])
  users: TeamUser[];
  @Field()
  locked: boolean;
  @Field((_type) => Boolean, { nullable: true })
  validated: boolean | null;
  @Field()
  closed: boolean;
  @Field()
  repo_url: string;
  @Field()
  repo_uuid: string;
  @Field((_type) => String, { nullable: true })
  locked_at: string | null;
  @Field((_type) => String, { nullable: true })
  closed_at: string | null;
  @Field()
  project_session_id: number;
  @Field()
  project_gitlab_path: string;
}

@ObjectType()
export class User {
  @Field()
  id: number;
  @Field()
  login: string;
  @Field()
  url: string;
}

@ObjectType()
export class Feedback {
  @Field()
  id: number;
  @Field()
  user: User;
  @Field()
  feedbackable_type: string;
  @Field()
  feedbackable_id: number;
  @Field()
  comment: string;
  @Field()
  rating: number;
  @Field()
  created_at: string;
}

@ObjectType()
export class ScaleTeam {
  //@Field()
  //_id: string;

  @Field()
  id: number;

  @Field()
  scale_id: number;

  @Field((_type) => String, { nullable: true })
  comment: string | null;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;

  @Field((_type) => String, { nullable: true })
  feedback: string | null;

  @Field((_type) => Int, { nullable: true })
  final_mark: number | null;

  @Field()
  flag: Flag1;

  @Field()
  begin_at: string;

  @Field((_type) => [User])
  correcteds: User[];

  @Field()
  corrector: User;

  //@Field((_type) => ObjectType)
  //truant: Object;

  @Field((_type) => String, { nullable: true })
  filled_at: string | null;

  //@Field((_type) => [ObjectType])
  //questions_with_answers: Object[];

  @Field()
  scale: Scale;

  @Field()
  team: Team;

  @Field((_type) => [Feedback])
  feedbacks: Feedback[];
}
