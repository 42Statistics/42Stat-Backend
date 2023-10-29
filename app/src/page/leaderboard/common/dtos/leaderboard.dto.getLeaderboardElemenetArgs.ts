import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, Max, Min } from 'class-validator';
import { PaginationIndexArgs } from 'src/pagination/index/dtos/pagination.index.dto.args';

@ArgsType()
export class GetLeaderboardElementArgs extends PaginationIndexArgs {
  @Min(1)
  @Max(100)
  @IsOptional()
  @Field({ nullable: true })
  promo?: number;

  @Min(1)
  @Max(1000)
  @IsOptional()
  @Field({ nullable: true })
  coalitionId?: number;
}
