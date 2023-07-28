import { Field, ObjectType } from '@nestjs/graphql';
import { ProjectPreview } from 'src/api/project/models/project.preview';
import { UserPreview } from 'src/common/models/common.user.model';

@ObjectType()
export class SearchResult {
  @Field((_type) => [UserPreview])
  userPreviews: UserPreview[];

  @Field((_type) => [ProjectPreview])
  projectPreviews: ProjectPreview[];
}
