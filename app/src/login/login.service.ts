import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { OAuth2Client } from 'google-auth-library';
import type { FilterQuery, Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { StatDate } from 'src/statDate/StatDate';
import { AccountDocument, account } from './db/account.database.schema';
import { token } from './db/token.database.schema';
import type { GoogleLoginInput, loginInput } from './dtos/login.dto';
import type { GoogleUser, StatusUnion, Success } from './models/login.model';

@UseFilters(HttpExceptionFilter)
@Injectable()
export class LoginService {
  constructor(
    @InjectModel(account.name) private accountModel: Model<account>,
    @InjectModel(token.name) private tokenModel: Model<token>,
    private readonly httpService: HttpService,
    private jwtService: JwtService,
  ) {}

  async findOneAccount(
    filter?: FilterQuery<account>,
  ): Promise<AccountDocument> {
    const account = await this.accountModel.findOne(filter);

    if (!account) {
      //todo: 빈 AccountDocument반환
      throw new NotFoundException();
    }

    return account;
  }

  async login({ code, google }: loginInput): Promise<typeof StatusUnion> {
    if (code && google) {
      const login42 = await this.loginWith42(code);
      const googleUser = await this.getGoogleUser(google);

      await this.upsertLogin(login42, googleUser);

      const accessToken = await this.generateAcccessToken(login42);
      const refreshToken = await this.generateRefreshToken(login42);

      return await this.upsertToken(login42, accessToken, refreshToken);
    }

    if (code) {
      const login42 = await this.loginWith42(code);

      await this.upsertLogin(login42);

      const accessToken = await this.generateAcccessToken(login42);
      const refreshToken = await this.generateRefreshToken(login42);

      return await this.upsertToken(login42, accessToken, refreshToken);
    }

    if (google) {
      return await this.loginWithGoogle(google);
    }

    throw new BadRequestException('Nothing input');
  }

  /**
   *
   * code를 받아 userId를 반환함
   * env가 설정되지 않은 경우 -> 500
   * code가 유효하지 않은 경우 -> 400
   *
   * userId 반환
   */
  async loginWith42(code: string): Promise<number> {
    const apiUid = process.env.CLIENT_ID;
    const apiSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;
    const intraTokenUrl = 'https://api.intra.42.fr/oauth/token';
    const intraMeUrl = 'https://api.intra.42.fr/v2/me';

    if (!(apiUid && apiSecret && redirectUri)) {
      throw new InternalServerErrorException(
        'Missing environment configuration',
      );
    }

    const params = new URLSearchParams();
    params.set('grant_type', 'authorization_code');
    params.set('client_id', apiUid);
    params.set('client_secret', apiSecret);
    params.set('code', code);
    params.set('redirect_uri', redirectUri);

    try {
      const tokens = await lastValueFrom(
        this.httpService.post<{
          access_token: string;
          expires_in: number;
          refresh_token: string;
        }>(intraTokenUrl, params),
      );

      const userInfo = await lastValueFrom(
        this.httpService.get<{ id: number }>(intraMeUrl, {
          headers: { Authorization: `Bearer ${tokens.data.access_token}` },
        }),
      );

      return userInfo.data.id;
    } catch (e) {
      throw new BadRequestException('42 code error');
    }
  }

  /**
   *
   * googleInput을 받아
   * 42연동이 필요한 유저이면 -> union 중 NoAssociated타입 반환 {message: 'NoAssociated'}
   * 이미 있는 유저이면 -> 조회 후 그 유저의 토큰 반환 (만료되었는지는 상관 x)
   *
   */
  async loginWithGoogle(
    googleInput: GoogleLoginInput,
  ): Promise<typeof StatusUnion> {
    const googleUser = await this.getGoogleUser(googleInput);
    const associateUser = await this.accountModel.findOne({
      googleId: googleUser.googleId,
    });

    if (!associateUser) {
      return {
        message: 'NoAssociated',
      };
    }

    const token = await this.tokenModel.findOne({
      userId: associateUser.userId,
    });

    if (!token) {
      const accessToken = await this.generateAcccessToken(associateUser.userId);
      const refreshToken = await this.generateRefreshToken(
        associateUser.userId,
      );

      await this.upsertToken(associateUser.userId, accessToken, refreshToken);

      return {
        userId: associateUser.userId,
        accessToken,
        refreshToken,
        message: 'OK',
      };
    }

    try {
      await this.jwtService.verifyAsync(token.refreshToken);
    } catch (e) {
      const accessToken = await this.generateAcccessToken(associateUser.userId);
      const refreshToken = await this.generateRefreshToken(
        associateUser.userId,
      );

      await this.upsertToken(associateUser.userId, accessToken, refreshToken);

      return {
        userId: associateUser.userId,
        accessToken,
        refreshToken,
        message: 'OK',
      };
    }

    return {
      userId: token.userId,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      message: 'OK',
    };
  }

  /**
   *
   * googleInput을 받아 디코딩 한 결과와 계정 연동한 시간을 반환
   * googleId, email, time
   * googleInput이 만료된 경우 -> 400 반환
   */
  async getGoogleUser(input: GoogleLoginInput): Promise<GoogleUser> {
    try {
      const client = new OAuth2Client({
        clientId: input.clientId,
      });

      const ticket = await client.verifyIdToken({
        idToken: input.credential,
        audience: input.clientId,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new BadRequestException('Google input 오류');
      }

      return {
        googleId: payload.sub,
        googleEmail: payload.email,
        linkedAt: new StatDate(),
      };
    } catch (e) {
      throw new BadRequestException('Google token 만료');
    }
  }

  /**
   *
   * userId로 조회 후 user가 없으면 새로 생성
   * googleUser도 들어왔을 경우 google 정보도 업데이트
   */
  async upsertLogin(userId: number, googleUser?: GoogleUser): Promise<boolean> {
    const updateData = {
      userId,
      googleId: googleUser?.googleId,
      googleEmail: googleUser?.googleEmail,
      linkedAt: googleUser?.linkedAt,
    };

    const user = await this.accountModel.findOneAndUpdate(
      { userId },
      updateData,
    );

    if (!user) {
      await this.accountModel.create({
        ...updateData,
        createdAt: new StatDate().toString(),
      });
    }

    return true;
  }

  /**
   *
   * userId로 조회 후 accessToken과 refreshToken을 등록
   * userId로 조회되지 않는 경우 -> 400반환
   *
   * userId, accessToken, refreshToken을 반환함
   */
  async upsertToken(
    userId: number,
    accessToken: string,
    refreshToken: string,
  ): Promise<typeof StatusUnion> {
    const newToken = await this.tokenModel.findOneAndUpdate(
      { userId },
      { userId, accessToken, refreshToken },
      { upsert: true, new: true },
    );

    if (!newToken) {
      throw new BadRequestException();
    }

    return {
      userId: newToken.userId,
      accessToken: newToken.accessToken,
      refreshToken: newToken.refreshToken,
      message: 'OK',
    };
  }

  //todo: google계정 upsert하는 함수 만들기

  /**
   *
   * header에 첨부된 accessToken을 decoding해 userId를 가져옴
   * googleInput을 통해 googleId, googleEmail, linkedAt을 받아옴
   * userId로 find 후 구글 정보들을 upsert 혹은 새로 만들어줌
   * 업데이트에 실패하거나 없는 userId로 find에 실패했을 시 false 반환
   */
  async linkGoogle(
    accessToken: string,
    google: GoogleLoginInput,
  ): Promise<boolean> {
    const token = accessToken.split(' ')[1];

    const { userId } = await this.jwtService.verifyAsync<{
      userId: number;
      iat: number;
      exp: number;
    }>(token);

    const googleUser = await this.getGoogleUser(google);
    const user = await this.accountModel.findOneAndUpdate(
      { userId },
      {
        userId,
        googleId: googleUser.googleId,
        googleEmail: googleUser.googleEmail,
        linkedAt: googleUser.linkedAt,
      },
      { upsert: true, new: true },
    );

    if (!user) {
      return false;
    }

    return true;
  }

  /**
   *
   * header에 첨부된 accessToken을 decoding해 userId를 가져옴
   * userId로 find 후 google과 관련된 정보를 삭제함
   * find에 실패했을시 false 반환
   */
  async unlinkGoogle(accessToken: string): Promise<boolean> {
    const token = accessToken.split(' ')[1];

    const { userId } = await this.jwtService.verifyAsync<{
      userId: number;
      iat: number;
      exp: number;
    }>(token);

    const user = await this.accountModel.findOneAndUpdate(
      { userId },
      { $unset: { googleId: 1, googleEmail: 1, linkedAt: 1 } },
    );

    if (!user) {
      return false;
    }

    return true;
  }

  /**
   *
   * input에 들어오는 userId는 AccountModel에 존재하는 유저이어야함
   * userId를 이용해 token을 생성함
   */
  async generateAcccessToken(userId: number): Promise<string> {
    const payload = { userId };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES,
      secret: process.env.JWT_SECRET,
    });

    return accessToken;
  }

  async generateRefreshToken(userId: number): Promise<string> {
    const payload = { userId };
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES,
      secret: process.env.JWT_SECRET,
    });

    return refreshToken;
  }

  /**
   *
   * accessToken이 만료되어 401이 반환된 경우 재발급받기위한 함수
   * refreshToken도 만료된 경우 -> 400 반환
   * refreshToken이 만료되지 않은 경우 userId를 통해 find 후
   * 새로 받급받은 accessToken과 기존 refreshToken으로 업데이트함
   */
  async refreshToken(refreshToken: string): Promise<Success> {
    try {
      const { userId, iat, exp } = await this.jwtService.verifyAsync<{
        userId: number;
        iat: number;
        exp: number;
      }>(refreshToken);

      const newAccessToken = await this.generateAcccessToken(userId);

      await this.tokenModel.findOneAndUpdate(
        { userId },
        { userId, accessToken: newAccessToken, refreshToken },
        { upsert: true, new: true },
      );

      return {
        userId,
        accessToken: newAccessToken,
        refreshToken,
        message: 'OK',
      };
    } catch (e) {
      throw new BadRequestException('유효하지 않은 refreshToken');
    }
  }

  /**
   *
   * header에 첨부된 accessToken을 가져옴
   * tokenDB에서 가져온 accessToken을 통해 find하고 해당 데이터를 삭제함
   */
  async logout(accessToken: string): Promise<boolean> {
    const token = accessToken.split(' ')[1];

    const deletedToken = await this.tokenModel.deleteOne({
      accessToken: token,
    });
    if (!deletedToken.deletedCount) {
      return false;
    }
    return true;
  }

  /**
   *
   * header에 첨부된 accessToken을 decoding해 userId를 가져옴
   * userId로 로그인했던 모든 토큰기록을 삭제함
   * userId로 가입했던 정보를 삭제함
   */
  async deleteAccount(accessToken: string): Promise<boolean> {
    const token = accessToken.split(' ')[1];

    const { userId } = await this.jwtService.verifyAsync<{
      userId: number;
      iat: number;
      exp: number;
    }>(token);

    await this.tokenModel.deleteMany({ userId });

    const deletedAccount = await this.accountModel.deleteOne({ userId });
    if (!deletedAccount.deletedCount) {
      return false;
    }
    return true;
  }

  //매달 1일 오전 5시 토큰 초기화
  @Cron('0 0 5 * *')
  async deleteAllToken() {
    await this.tokenModel.deleteMany();
  }
}
