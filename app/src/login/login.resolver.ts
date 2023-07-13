import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MyAccessToken, MyUserId } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { GoogleLoginInput, LoginInput } from './dtos/login.dto';
import { LoginService } from './login.service';
import { LoginResult, Success, UserAccount } from './models/login.model';

@UseFilters(HttpExceptionFilter)
@Resolver()
export class LoginResolver {
  constructor(private readonly loginService: LoginService) {}

  @Mutation((_returns) => LoginResult)
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<typeof LoginResult> {
    return await this.loginService.login(loginInput);
  }

  @UseGuards(StatAuthGuard)
  @Mutation((_returns) => UserAccount)
  async linkGoogle(
    @MyUserId() userId: number,
    @Args('google') google: GoogleLoginInput,
  ): Promise<UserAccount> {
    return await this.loginService.linkGoogle(userId, google);
  }

  @UseGuards(StatAuthGuard)
  @Mutation((_returns) => UserAccount)
  async unlinkGoogle(@MyUserId() userId: number): Promise<UserAccount> {
    return await this.loginService.unlinkGoogle(userId);
  }

  @Mutation((_returns) => LoginResult)
  async refreshToken(
    @Args('refreshToken') refreshToken: string,
  ): Promise<Success> {
    return await this.loginService.refreshToken(refreshToken);
  }

  @UseGuards(StatAuthGuard)
  @Mutation((_returns) => Boolean)
  async logout(@MyAccessToken() accessToken: string): Promise<number> {
    return await this.loginService.logout(accessToken);
  }

  @UseGuards(StatAuthGuard)
  @Mutation((_returns) => Boolean)
  async deleteAccount(@MyUserId() userId: number): Promise<number> {
    return await this.loginService.deleteAccount(userId);
  }
}
