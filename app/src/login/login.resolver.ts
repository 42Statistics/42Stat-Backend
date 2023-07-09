import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GoogleLoginInput } from './dtos/login.dto';
import { LoginService } from './login.service';
import { StatusUnion } from './models/login.model';

@Resolver()
export class LoginResolver {
  constructor(private readonly loginService: LoginService) {}

  @Mutation((_returns) => StatusUnion)
  async login(
    @Args('code', { nullable: true }) code?: string,
    @Args('google', { nullable: true }) google?: GoogleLoginInput,
  ): Promise<typeof StatusUnion> {
    return await this.loginService.login({ code, google });
  }

  @Mutation((_returns) => Boolean)
  async linkGoogle(
    @Args('accessToken') accessToken: string,
    @Args('google') google: GoogleLoginInput,
  ): Promise<boolean> {
    return await this.loginService.linkGoogle(accessToken, google);
  }

  @Mutation((_returns) => Boolean)
  async unlinkGoogle(
    @Args('accessToken') accessToken: string,
  ): Promise<boolean> {
    return await this.loginService.unlinkGoogle(accessToken);
  }

  @Mutation((_returns) => StatusUnion)
  async refreshToken(
    @Args('accessToken') accessToken: string,
    @Args('refreshToken') refreshToken: string,
  ): Promise<typeof StatusUnion> {
    return await this.loginService.refreshToken(accessToken, refreshToken);
  }

  @Mutation((_returns) => Boolean)
  async logout(@Args('accessToken') accessToken: string): Promise<boolean> {
    return await this.loginService.logout(accessToken);
  }

  @Mutation((_returns) => Boolean)
  async deleteAccount(
    @Args('accessToken') accessToken: string,
  ): Promise<boolean> {
    return await this.loginService.deleteAccount(accessToken);
  }
}
