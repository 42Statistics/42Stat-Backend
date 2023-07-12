import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MyAccessToken } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { GoogleLoginInput, LoginInput } from './dtos/login.dto';
import { LoginService } from './login.service';
import { StatusUnion, Success } from './models/login.model';

@UseFilters(HttpExceptionFilter)
@Resolver()
export class LoginResolver {
  constructor(private readonly loginService: LoginService) {}

  @Mutation((_returns) => StatusUnion)
  async login(
    @Args('loginInput') loginInput: LoginInput,
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
    @Args('refreshToken') refreshToken: string,
  ): Promise<Success> {
    return await this.loginService.refreshToken(refreshToken);
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
