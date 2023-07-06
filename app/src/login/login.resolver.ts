import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GoogleLoginInput } from './dtos/login.dto';
import { LoginService } from './login.service';
import { StatusType } from './models/login.model';

@Resolver()
export class LoginResolver {
  constructor(private readonly loginService: LoginService) {}

  @Mutation((_returns) => [StatusType])
  async login(
    @Args('code', { nullable: true }) code?: string,
    @Args('google', { nullable: true }) google?: GoogleLoginInput,
  ): Promise<(typeof StatusType)[]> {
    return await this.loginService.login({ code, google });
  }

  @Mutation((_returns) => Boolean)
  async linkGoogle(
    @Args('userId') userId: number,
    @Args('google') google: GoogleLoginInput,
  ): Promise<boolean> {
    return await this.loginService.linkGoogle(userId, google);
  }

  @Mutation((_returns) => Boolean)
  async unlinkGoogle(@Args('userId') userId: number): Promise<boolean> {
    return await this.loginService.unlinkGoogle(userId);
  }
}
