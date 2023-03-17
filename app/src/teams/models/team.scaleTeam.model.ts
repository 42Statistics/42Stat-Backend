import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TeamScaleTeam {
  @Field((_type) => ID)
  id: string;

  @Field((_type) => ID)
  scaleId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
  // todo: 이런건 그냥 제공하지 않는 방법도...

  @Field({ nullable: true })
  feedback?: string;

  @Field({ nullable: true })
  finalMark?: number;

  @Field()
  flag: string;
  // todo: flag type // teamFlag || poplulated flag 이정도로 작은 것들은 실제로 document에 있어도 join해서 타입 줄이는 것도 가능할듯.

  @Field()
  beginAt: Date;

  @Field()
  correcteds: string;
  // todo: ScaleTeamUser

  @Field()
  corrector: string;
  // todo: ScaleTeamUser

  @Field({ nullable: true })
  filledAt: Date;
}

/*
        "scale_teams": [
            {
                "id": 5177871,
                "scale_id": 19210,
                "comment": null,
                "created_at": "2023-03-15T22:41:44.981Z",
                "updated_at": "2023-03-15T22:41:44.981Z",
                "feedback": null,
                "final_mark": null,
                "flag": {
                    "id": 1,
                    "name": "Ok",
                    "positive": true,
                    "icon": "check-4",
                    "created_at": "2015-09-14T23:06:52.000Z",
                    "updated_at": "2015-09-14T23:06:52.000Z"
                },
                "begin_at": "2023-03-16T00:00:00.000Z",
                "correcteds": [
                    {
                        "id": 104059,
                        "login": "joonhan",
                        "url": "https://api.intra.42.fr/v2/users/joonhan"
                    }
                ],
                "corrector": {
                    "id": 110772,
                    "login": "junyoung",
                    "url": "https://api.intra.42.fr/v2/users/junyoung"
                },
                "truant": {},
                "filled_at": null,
                "questions_with_answers": []
            },
            {
                "id": 5177860,
                "scale_id": 19210,
                "comment": null,
                "created_at": "2023-03-15T22:37:49.195Z",
                "updated_at": "2023-03-15T22:37:49.195Z",
                "feedback": null,
                "final_mark": null,
                "flag": {
                    "id": 1,
                    "name": "Ok",
                    "positive": true,
                    "icon": "check-4",
                    "created_at": "2015-09-14T23:06:52.000Z",
                    "updated_at": "2015-09-14T23:06:52.000Z"
                },
                "begin_at": "2023-03-16T01:30:00.000Z",
                "correcteds": "invisible",
                "corrector": "invisible",
                "truant": {},
                "filled_at": null,
                "questions_with_answers": []
            }
        ],
        "teams_uploads": []
    },
*/
