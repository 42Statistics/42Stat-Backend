import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cron } from '@nestjs/schedule';
import { OAuth2Client } from 'google-auth-library';
import mongoose from 'mongoose';
import { lastValueFrom } from 'rxjs';
import type { token } from 'src/auth/token/db/token.database.schema';
import { TokenService } from 'src/auth/token/token.service';
import type { FtClientConfig } from 'src/config/configuration/ftClient.config';
import type { GoogleClientConfig } from 'src/config/configuration/googleClient.config';
import type { JwtConfig } from 'src/config/configuration/jwt.config';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { AccountService } from 'src/login/account/account.service';
import { DateWrapper } from 'src/statDate/StatDate';
import type { GoogleLoginInput } from './dtos/login.dto';
import type {
  Account,
  LinkedAccount,
  LoginResult,
  LoginSuccess,
} from './models/login.model';

@UseFilters(HttpExceptionFilter)
@Injectable()
export class LoginService {
  private readonly jwt;
  private readonly ftClient;
  private readonly googleClient;

  constructor(
    private readonly accountService: AccountService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {
    this.jwt = this.configService.getOrThrow<JwtConfig>('jwt');
    this.ftClient = this.configService.getOrThrow<FtClientConfig>('ftClient');
    this.googleClient =
      this.configService.getOrThrow<GoogleClientConfig>('googleClient');
  }

  async ftLogin(ftCode: string): Promise<LoginSuccess> {
    const userId = await this.getFtUser(ftCode);

    const user = await this.accountService.findOne({ filter: { userId } });

    if (!user) {
      await this.createAccount(userId);
    }

    const loginUser = await this.createToken(userId);

    return loginUser;
  }

  /**
   *
   * @returns 연동이 필요한 계정: LoginNotLinked
   * @returns 존재하는 유저: LoginSuccess
   */
  async googleLogin(
    google: GoogleLoginInput,
    ftCode?: string,
  ): Promise<typeof LoginResult> {
    const googleUser = await this.getGoogleUser(google);

    if (ftCode) {
      const userId = await this.getFtUser(ftCode);

      await this.createAccount(userId);
      await this.linkGoogle(userId, googleUser);

      const loginUser = await this.createToken(userId);

      return loginUser;
    }

    const linkedUser = await this.accountService.findOne({
      filter: {
        'linkedAccounts.platform': 'google',
        'linkedAccounts.id': googleUser.id,
      },
    });

    if (!linkedUser) {
      return {
        message: 'NotLinked',
      };
    }

    const token = await this.createToken(linkedUser.userId);

    return token;
  }

  /**
   *
   * @throws {BadRequestException} ftCode가 유효하지 않은 경우
   */
  async getFtUser(ftCode: string): Promise<number> {
    const params = new URLSearchParams();
    params.set('grant_type', 'authorization_code');
    params.set('client_id', this.ftClient.ID);
    params.set('client_secret', this.ftClient.SECRET);
    params.set('code', ftCode);
    params.set('redirect_uri', this.ftClient.REDIRECT_URI);

    try {
      const tokens = await lastValueFrom(
        this.httpService.post<{ access_token: string }>(
          this.ftClient.INTRA_TOKEN_URI,
          params,
        ),
      );

      const userInfo = await lastValueFrom(
        this.httpService.get<{ id: number }>(this.ftClient.INTRA_ME_URI, {
          headers: { Authorization: `Bearer ${tokens.data.access_token}` },
        }),
      );

      return userInfo.data.id;
    } catch (e) {
      throw new BadRequestException('42 code error');
    }
  }

  async generateTokenPair(userId: number): Promise<Omit<token, 'userId'>> {
    const accessToken = await this.generateToken(
      userId,
      this.jwt.ACCESS_EXPIRES,
    );
    const refreshToken = await this.generateToken(
      userId,
      this.jwt.REFRESH_EXPIRES,
    );

    return { accessToken, refreshToken };
  }

  /**
   *
   * @throws {BadRequestException} 외부 사이트에서 인증된 googleInput인 경우
   */
  async getGoogleUser(input: GoogleLoginInput): Promise<LinkedAccount> {
    const oAuth2Client = new OAuth2Client();

    const ticket = await oAuth2Client.verifyIdToken({
      idToken: input.credential,
      audience: input.clientId,
    });

    // https://github.com/googleapis/google-auth-library-nodejs/blob/main/src/auth/oauth2client.ts#L1277
    // https://github.com/googleapis/google-auth-library-nodejs/blob/main/src/auth/loginticket.ts#L26
    // eslint-disable-next-line
    const { sub, email, aud } = ticket.getPayload()!;

    if (aud !== this.googleClient.CLIENT_ID) {
      throw new BadRequestException();
    }

    return {
      platform: 'google',
      id: sub,
      email: email,
      linkedAt: new Date(),
    };
  }

  async createAccount(userId: number): Promise<Account> {
    return await this.accountService.create(userId);
  }

  async createToken(userId: number): Promise<LoginSuccess> {
    const { accessToken, refreshToken } = await this.generateTokenPair(userId);

    const newToken = await this.tokenService.create(
      userId,
      accessToken,
      refreshToken,
    );

    return {
      ...newToken,
      message: 'OK',
    };
  }

  /**
   * @throws {Error} 이미 연동되어있는 유저인 경우
   * @throws {NotFoundException} 없는 유저인 경우
   */
  async linkGoogle(userId: number, account: LinkedAccount): Promise<Account> {
    const update = await this.accountService.findOne({
      filter: { userId, 'linkedAccounts.platform': account.platform },
    });

    if (update) {
      throw new Error();
    }

    const updatedAccount = await this.accountService.findOneAndUpdate(
      { userId },
      { $push: { linkedAccounts: { ...account } } },
      { upsert: true, new: true },
    );

    if (!updatedAccount) {
      throw new NotFoundException();
    }

    return updatedAccount;
  }

  /**
   *
   * @throws {NotFoundException} 없는 유저인 경우
   */
  async unlinkAccount(
    userId: number,
    targetPlatform: string,
  ): Promise<Account> {
    const user = await this.accountService.findOneAndUpdate(
      { userId },
      {
        $pull: { linkedAccounts: { platform: targetPlatform } },
      },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async generateToken(userId: number, expiresIn: string): Promise<string> {
    return await this.jwtService.signAsync(
      { userId },
      {
        expiresIn: expiresIn,
        secret: this.jwt.SECRET,
      },
    );
  }

  /**
   *
   * @throws {BadRequestException} 유효하지 않은 refreshToken 인 경우
   */
  async refreshToken(refreshToken: string): Promise<LoginSuccess> {
    let userId: number;

    try {
      userId = await this.verifyToken(refreshToken);
    } catch (e) {
      throw new BadRequestException('유효하지 않은 refreshToken');
    }

    const accessToken = await this.generateToken(
      userId,
      this.jwt.ACCESS_EXPIRES,
    );

    const newTokens = await this.tokenService.findOneAndUpdate(
      { refreshToken },
      { userId, accessToken, refreshToken },
      { new: true },
    );

    if (!newTokens) {
      throw new BadRequestException();
    }

    return {
      ...newTokens,
      message: 'OK',
    };
  }

  async logout(accessToken: string): Promise<number> {
    return await this.tokenService.deleteOne({
      accessToken,
    });
  }

  async deleteAccount(userId: number): Promise<number> {
    await this.tokenService.deleteMany({ userId });

    return await this.accountService.deleteOne({ userId });
  }

  async verifyToken(targetToken: string): Promise<number> {
    try {
      const verifiedToken = await this.jwtService.verifyAsync(targetToken);

      return verifiedToken.userId;
    } catch (e) {
      throw new UnauthorizedException('Token expired');
    }
  }

  /**
   * @description 매일 05:00에 로그인 후 1주일이 지난 토큰을 삭제
   */
  @Cron('0 5 * * *')
  async deleteTokens() {
    const beforeOneWeek = new DateWrapper().moveWeek(-1).toDate();

    await this.tokenService.deleteMany({
      _id: {
        $lt: mongoose.Types.ObjectId.createFromTime(
          Math.floor(beforeOneWeek.getTime() / DateWrapper.SEC),
        ),
      },
    });
  }
}
