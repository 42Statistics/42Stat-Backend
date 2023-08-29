import { Field, Float, ObjectType, PickType } from '@nestjs/graphql';
import { UserProfile } from 'src/page/personal/general/models/personal.general.userProfile.model';
import { IndexPaginated } from 'src/pagination/index/models/pagination.index.model';
import { z } from 'zod';

// todo: userProfile 과 동기화
export const userPreviewSchema = z.object({
  id: z.number(),
  login: z.string(),
  imgUrl: z.string().nullish(),
});

export const userRankSchema = z.object({
  userPreview: userPreviewSchema,
  value: z.number(),
  rank: z.number(),
});

@ObjectType()
export class UserPreview
  extends PickType(UserProfile, ['id', 'login', 'imgUrl'])
  implements z.infer<typeof userPreviewSchema> {}

@ObjectType()
export class UserRank implements z.infer<typeof userRankSchema> {
  @Field((_type) => UserPreview)
  userPreview: UserPreview;

  @Field((_type) => Float)
  value: number;

  @Field()
  rank: number;
}

@ObjectType()
export class UserRankingIndexPaginated extends IndexPaginated(UserRank) {}
