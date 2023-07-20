import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
import { AccountService } from 'src/login/account/account.service';
import type { token } from 'src/auth/token/db/token.database.schema';
import { TokenService } from 'src/auth/token/token.service';
import type { FtClientConfig } from 'src/config/configuration/ftClient.config';
import type { GoogleClientConfig } from 'src/config/configuration/googleClient.config';
import type { JwtConfig } from 'src/config/configuration/jwt.config';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { StatDate } from 'src/statDate/StatDate';
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
  private jwt;
  private ftClient;
  private googleClient;

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

  /**
   *
   * 42 code를 통해 로그인 하거나 가입
   */
  async ftLogin(ftCode: string): Promise<LoginSuccess> {
    const userId = await this.getFtUser(ftCode);

    const user = await this.accountService.findOne({ userId });

    if (!user) {
      await this.createAccount(userId);
    }

    const loginUser = await this.createToken(userId);

    return loginUser;
  }

  /**
   *
   * (google)
   *   42연동이 필요한 유저이면 -> union 중 NotLinked타입 반환 {message: 'NotLinked'}
   *   이미 있는 유저이면 -> 조회 후 그 유저의 새로운 토큰 반환
   * (google, ftCode)
   *   가입 & 연동 후 유저의 새로운 토큰 반환
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
      'linkedAccount.platform': 'google',
      'linkedAccount.id': googleUser.id,
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
   * ftCode를 받아 userId를 반환함
   * env가 설정되지 않은 경우 -> 500
   * ftCode가 유효하지 않은 경우 -> 400
   *
   * userId 반환
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
   * googleInput을 받아 디코딩 한 결과와 계정 연동한 시간을 반환
   * googleId, email, time
   * googleInput이 만료된 경우 -> 400 반환
   */
  async getGoogleUser(input: GoogleLoginInput): Promise<LinkedAccount> {
    const oAuth2Client = new OAuth2Client();

    const ticket = await oAuth2Client.verifyIdToken({
      idToken: input.credential,
      audience: input.clientId,
    });

    const { sub, email, aud } = ticket.getPayload()!;

    if (aud !== this.googleClient.CLIENT_ID) {
      throw new BadRequestException();
    }

    return {
      platform: 'google',
      id: sub,
      email: email,
      // StatDate 사용 시 mongoose 가 제대로 처리하지 못하는 문제가 있음
      linkedAt: new Date(),
    };
  }

  /**
   *
   * userId로 조회 후 user가 없으면 새로 생성
   */
  async createAccount(userId: number): Promise<Account> {
    return await this.accountService.create(userId);
  }

  /**
   *
   * userId로 조회 후 accessToken과 refreshToken을 등록
   * userId로 조회되지 않는 경우 -> 400반환
   *
   * userId, accessToken, refreshToken을 반환함
   */
  async createToken(userId: number): Promise<LoginSuccess> {
    const { accessToken, refreshToken } = await this.generateTokenPair(userId);

    // const newToken =
    await this.tokenService.create(userId, accessToken, refreshToken);

    return {
      //todo: find lean
      // ...newToken,
      userId,
      accessToken,
      refreshToken,
      message: 'OK',
    };
  }

  /**
   *
   * header에 첨부된 accessToken을 decoding해 userId를 가져옴
   * account 통해 id, email, linkedAt을 받아옴
   * userId로 find 후 구글 정보들을 upsert 후 업데이트된 데이터를 반환
   * 없는 유저가 이 함수를 시도할 경우 -> 500 반환
   */
  async linkGoogle(userId: number, account: LinkedAccount): Promise<Account> {
    const update = await this.accountService.findOne({
      userId,
      'linkedAccount.platform': account.platform,
    });

    if (update) {
      throw new Error();
    }

    const updatedAccount = await this.accountService.findOneAndUpdate(
      { userId },
      { $push: { linkedAccount: { ...account } } },
      { upsert: true, new: true },
    );

    if (!updatedAccount) {
      throw new NotFoundException();
    }

    return updatedAccount;
  }

  /**
   *
   * header에 첨부된 accessToken을 decoding해 userId를 가져옴
   * userId로 find 후 google과 관련된 정보를 삭제함
   * 없는 유저가 이 함수를 시도할 경우 -> 500 반환
   */
  async unlinkAccount(
    userId: number,
    targetPlatform: string,
  ): Promise<Account> {
    const user = await this.accountService.findOneAndUpdate(
      { userId },
      {
        $pull: { linkedAccount: { platform: targetPlatform } },
      },
      { new: true },
    );

    if (!user) {
      throw new InternalServerErrorException();
    }

    return user;
  }

  /**
   *
   * input에 들어오는 userId는 accountService에 존재하는 유저이어야함
   * userId를 이용해 token을 생성함
   */
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
   * accessToken이 만료되어 401이 반환된 경우 재발급받기위한 함수
   * refreshToken도 만료된 경우 -> 400 반환
   * refreshToken이 만료되지 않은 경우 userId를 통해 find 후
   * 새로 받급받은 accessToken과 기존 refreshToken으로 업데이트함
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
      { new: true, lean: true },
    );

    if (!newTokens) {
      throw new BadRequestException();
    }

    return {
      ...newTokens,
      message: 'OK',
    };
  }

  /**
   *
   * header에 첨부된 accessToken을 가져옴
   * tokenDB에서 가져온 accessToken을 통해 find하고 해당 데이터를 삭제함
   * 지운 토큰의 수를 반환함 (1)
   */
  async logout(accessToken: string): Promise<number> {
    return await this.tokenService.deleteOne({
      accessToken,
    });
  }

  /**
   *
   * header에 첨부된 accessToken을 decoding해 userId를 가져옴
   * userId로 로그인했던 모든 토큰기록을 삭제함
   * userId로 가입했던 정보를 삭제함
   * 지운 계정의 수를 반환함 (1)
   */
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
   *
   * 매일 5시에 자동으로 실행되는 함수
   * 로그인 후 1주일이 지난 토큰을 삭제함
   */
  @Cron('0 5 * * *')
  async deleteTokens() {
    const beforeOneWeek = new StatDate().moveWeek(-1);

    await this.tokenService.deleteMany({
      _id: {
        $lt: mongoose.Types.ObjectId.createFromTime(
          Math.floor(beforeOneWeek.getTime() / StatDate.SEC),
        ),
      },
    });
  }
}
