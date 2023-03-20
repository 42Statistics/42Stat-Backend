import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { ScaleTeamUserPartial } from './scaleTeam.partial.model';

@ObjectType()
export class ScaleTeamBase {
  @Field((_type) => ID)
  id: string;

  @Field((_type) => ID)
  scaleId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({
    description:
      '평가 슬롯의 시작 시간 입니다. 실제 시작 시간은 다를 수 있습니다.',
  })
  beginAt: Date;

  @Field((_type) => Date, { nullable: true })
  filledAt: Date | null;

  @Field((_type) => Int, { nullable: true })
  finalMark: number | null;

  @Field()
  flag: string; // todo

  @Field((_type) => [ScaleTeamUserPartial], {
    nullable: true,
    description: '평가 시간 전에는 null이 반환됩니다.',
  })
  correcteds: ScaleTeamUserPartial[] | null;

  @Field((_type) => String, {
    nullable: true,
    description: '피평가자들의 feedback 입니다.',
  })
  feedback: string | null;

  @Field((_type) => ScaleTeamUserPartial, {
    nullable: true,
    description: '평가 시간 전에는 null이 반환됩니다.',
  })
  corrector: ScaleTeamUserPartial | null;

  @Field((_type) => String, {
    nullable: true,
    description: '평가자의 comment 입니다.',
  })
  comment: string | null;
}
