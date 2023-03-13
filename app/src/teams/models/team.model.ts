import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Project } from 'src/projects/models/project.model';
import { User } from 'src/users/models/user.model';
import { TeamUser } from './team.user.model';

@ObjectType()
export class Team {
  @Field((_type) => Int)
  id: number;

  @Field()
  name: string;

  @Field((_type) => Int, { nullable: true })
  finalMark: number;

  @Field({ nullable: true })
  lockedAt: Date;

  @Field({ nullable: true })
  closedAt: Date;

  @Field()
  status: string;

  @Field({ nullable: true })
  isValidated: boolean;

  @Field((_type) => [TeamUser])
  users: TeamUser[];

  @Field((_type) => [User])
  _users: User[];

  @Field((_type) => Int)
  projectId: number;

  @Field((_type) => Project)
  _project: Project;

  @Field((_type) => Int)
  projectSessionId: number;

  @Field()
  evals: string; // todo Eval
}

/*
        "team": {
            "id": 4740890,
            "name": "sanan's group",
            "url": "https://api.intra.42.fr/v2/teams/4740890",
            "final_mark": null,
            "project_id": 2007,
            "created_at": "2023-03-07T02:52:04.718Z",
            "updated_at": "2023-03-13T07:53:31.539Z",
            "status": "waiting_for_correction",
            "terminating_at": null,
            "users": [
                {
                    "id": 131541,
                    "login": "sanan",
                    "url": "https://api.intra.42.fr/v2/users/sanan",
                    "leader": true,
                    "occurrence": 0,
                    "validated": true,
                    "projects_user_id": 3017311
                }
            ],
            "locked?": true,
            "validated?": null,
            "closed?": true,
            "repo_url": "git@vogsphere.42seoul.kr:vogsphere/intra-uuid-35104d6b-7d42-4b72-b0ea-93abc8118f77-4740890-sanan",
            "repo_uuid": "intra-uuid-35104d6b-7d42-4b72-b0ea-93abc8118f77-4740890-sanan",
            "locked_at": "2023-03-07T02:52:04.745Z",
            "closed_at": "2023-03-13T06:51:54.653Z",
            "project_session_id": 6966,
            "project_gitlab_path": "pedago_world/42-cursus/inner-circle/net_practice"
        },
*/
