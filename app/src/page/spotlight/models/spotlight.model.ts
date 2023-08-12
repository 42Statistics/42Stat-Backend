import { Field, ObjectType } from '@nestjs/graphql';
import { ProjectPreview } from 'src/common/models/common.project.model';
import { UserPreview } from 'src/common/models/common.user.model';

// todo: deprecated at 0.7.0
@ObjectType()
export class SearchResult {
  @Field((_type) => [UserPreview])
  userPreviews: UserPreview[];

  @Field((_type) => [ProjectPreview])
  projectPreviews: ProjectPreview[];
}

@ObjectType()
export class Spotlight {
  @Field((_type) => [UserPreview])
  userPreviews: UserPreview[];

  @Field((_type) => [ProjectPreview])
  projectPreviews: ProjectPreview[];
}
