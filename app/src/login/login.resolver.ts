import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GoogleLoginInput, loginInput } from './dtos/login.dto';
import { LoginService } from './login.service';
import { StatusUnion } from './models/login.model';
import { UseGuards } from '@nestjs/common';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { MyAccessToken } from 'src/auth/myContext';

@Resolver()
export class LoginResolver {
  constructor(private readonly loginService: LoginService) {}

  @Mutation((_returns) => StatusUnion)
  async login(
    @Args('loginInput') loginInput: loginInput,
  ): Promise<typeof StatusUnion> {
    return await this.loginService.login(loginInput);
  }

  @UseGuards(StatAuthGuard)
  @Mutation((_returns) => Boolean)
  async linkGoogle(
    @MyAccessToken() accessToken: string,
    @Args('google') google: GoogleLoginInput,
  ): Promise<boolean> {
    return await this.loginService.linkGoogle(accessToken, google);
  }

  @UseGuards(StatAuthGuard)
  @Mutation((_returns) => Boolean)
  async unlinkGoogle(@MyAccessToken() accessToken: string): Promise<boolean> {
    return await this.loginService.unlinkGoogle(accessToken);
  }

  @Mutation((_returns) => StatusUnion)
  async refreshToken(
    @Args('accessToken') accessToken: string,
    @Args('refreshToken') refreshToken: string,
  ): Promise<typeof StatusUnion> {
    return await this.loginService.refreshToken(accessToken, refreshToken);
  }

  @UseGuards(StatAuthGuard)
  @Mutation((_returns) => Boolean)
  async logout(@MyAccessToken() accessToken: string): Promise<boolean> {
    return await this.loginService.logout(accessToken);
  }

  @UseGuards(StatAuthGuard)
  @Mutation((_returns) => Boolean)
  async deleteAccount(@MyAccessToken() accessToken: string): Promise<boolean> {
    return await this.loginService.deleteAccount(accessToken);
  }
}
