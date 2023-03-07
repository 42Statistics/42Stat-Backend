import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserProject {
  @Field((_type) => Int)
  id: number;

  @Field((_type) => Int)
  occurrence: number;

  @Field({ nullable: true })
  markedAt: string;

  @Field()
  createdAt: string;

  @Field((_type) => Int, { nullable: true })
  finalMark: number | null;

  // todo: 아래 주석같은 부분 api docs에 들어가도록 처리
  // 통과: true, 실패: false, 평가 안받음: null
  @Field({ nullable: true })
  validated: boolean;

  @Field()
  status: string;

  @Field((_type) => Int)
  currentTeamId: number;

  @Field()
  marked: boolean;

  @Field((_type) => Int)
  projectId: number;

  @Field()
  projectName: string;

  @Field((_type) => Int)
  cursusId: number;
}
