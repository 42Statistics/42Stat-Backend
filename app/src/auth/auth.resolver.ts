import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LoginUser } from './auth.models';
import { AuthService } from './auth.service';
import { GoogleLoginInput } from './google.login.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation((_type) => LoginUser)
  async loginWithGoogle(
    @Args('input') input: GoogleLoginInput,
  ): Promise<LoginUser> {
    return this.authService.loginWithGoogle(input);
  }
}
