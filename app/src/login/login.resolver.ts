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
    @Args('userId') userId: number,
    @Args('google') google: GoogleLoginInput,
  ): Promise<boolean> {
    return await this.loginService.linkGoogle(userId, google);
  }

  @Mutation((_returns) => Boolean)
  async unlinkGoogle(@Args('userId') userId: number): Promise<boolean> {
    return await this.loginService.unlinkGoogle(userId);
  }

  @Mutation((_returns) => StatusUnion)
  async refreshToken(
    @Args('accessToken') accessToken: string,
    @Args('refreshToken') refreshToken: string,
  ): Promise<typeof StatusUnion> {
    return await this.loginService.refreshToken(accessToken, refreshToken);
  }

  @Mutation((_returns) => Boolean)
  async logout(@Args('userId') userId: number): Promise<boolean> {
    return await this.loginService.logout(userId);
  }

  @Mutation((_returns) => Boolean)
  async deleteAccount(@Args('userId') userId: number): Promise<boolean> {
    return await this.loginService.deleteAccount(userId);
  }
}
