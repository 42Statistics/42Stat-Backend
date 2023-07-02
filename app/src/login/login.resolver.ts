import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Tokens } from './models/login.models';
import { AuthService } from './login.service';
import { GoogleLoginInput } from './login.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation((_returns) => Tokens)
  async login(
    @Args('code', { nullable: true }) code?: string,
    @Args('google', { nullable: true }) google?: GoogleLoginInput,
  ): Promise<Tokens> {
    return await this.authService.login({ code, google });
  }
}
