import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TeamUser {
  @Field((_type) => ID)
  id: string;

  @Field()
  login: string;

  @Field()
  leader: boolean;

  @Field()
  occurrence: number;

  @Field((_type) => ID)
  projectUserId: string;
}

/*
  "users": [
      {
          "id": 104059,
          "login": "joonhan",
          "url": "https://api.intra.42.fr/v2/users/joonhan",
          "leader": true,
          "occurrence": 1,
          "validated": true,
          "projects_user_id": 3026181
      }
  ],
*/
