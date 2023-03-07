import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@Resolver((_of: unknown) => User)
export class UserResolver {
  constructor(private usersService: UsersService) {}

  @Query((_returns) => User)
  async user(@Args('id', { type: () => Int }) id: number) {
    const user = await this.usersService.findOneById(id);
    return user;
  }

  @ResolveField()
  async id(@Parent() user: User) {
    return user.id;
  }
}
