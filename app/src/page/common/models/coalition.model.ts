import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Coalition {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field({ deprecationReason: 'deprecated at v0.9.0' })
  slug: string;

  @Field({ deprecationReason: 'deprecated at v0.9.0, imgUrl 을 사용하세요.' })
  imageUrl: string;

  @Field()
  imgUrl: string;

  @Field()
  coverUrl: string;

  @Field()
  color: string;

  @Field({ deprecationReason: 'deprecated at v0.9.0' })
  score: number;

  @Field({
    description: '코알리숑 마스터의 user id 입니다.',
    deprecationReason: 'deprecated at v0.9.0',
  })
  userId: number;
}
