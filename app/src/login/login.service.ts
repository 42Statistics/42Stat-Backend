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
import mongoose from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { ConfigRegister } from 'src/config/config.register';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { StatDate } from 'src/statDate/StatDate';
import { account, type AccountDocument } from './db/account.database.schema';
import { token } from './db/token.database.schema';
import type { GoogleLoginInput } from './dtos/login.dto';
import type {
  GoogleUser,
  LoginResult,
  LoginSuccess,
} from './models/login.model';

@UseFilters(HttpExceptionFilter)
@Injectable()
export class LoginService {
  constructor(
    @InjectModel(account.name)
    private accountModel: Model<account>,
    @InjectModel(token.name)
    private tokenModel: Model<token>,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly configRegister: ConfigRegister,
  ) {}

  async findOneAccount(
    filter?: FilterQuery<account>,
  ): Promise<AccountDocument> {
    const account = await this.accountModel.findOne(filter);

    if (!account) {
      throw new NotFoundException();
    }

    return account;
  }

  /**
   *
   * 42 code를 통해 로그인 하거나 가입
   */
  async ftLogin(ftCode: string): Promise<LoginSuccess> {
    const userId = await this.getFtUser(ftCode);

    await this.upsertLogin(userId);

    return await this.updateToken(userId);
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

      await this.upsertLogin(userId, googleUser);

      return await this.updateToken(userId);
    }

    const linkedUser = await this.accountModel.findOne({
      googleId: googleUser.googleId,
    });

    if (!linkedUser) {
      return {
        message: 'NotLinked',
      };
    }

    return await this.updateToken(linkedUser.userId);
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
    const client = this.configRegister.getClient();

    const params = new URLSearchParams();
    params.set('grant_type', 'authorization_code');
    params.set('client_id', client.ID);
    params.set('client_secret', client.SECRET);
    params.set('code', ftCode);
    params.set('redirect_uri', client.REDIRECT_URI);

    try {
      const tokens = await lastValueFrom(
        this.httpService.post<{ access_token: string }>(
          client.INTRA_TOKEN_URI,
          params,
        ),
      );

      const userInfo = await lastValueFrom(
        this.httpService.get<{ id: number }>(client.INTRA_ME_URI, {
          headers: { Authorization: `Bearer ${tokens.data.access_token}` },
        }),
      );

      return userInfo.data.id;
    } catch (e) {
      throw new BadRequestException('42 code error');
    }
  }

  async generateTokenPair(userId: number): Promise<Omit<token, 'userId'>> {
    const jwt = this.configRegister.getJwt();

    const accessToken = await this.generateToken(userId, jwt.ACCESS_EXPIRES);
    const refreshToken = await this.generateToken(userId, jwt.REFRESH_EXPIRES);

    return { accessToken, refreshToken };
  }

  /**
   *
   * googleInput을 받아 디코딩 한 결과와 계정 연동한 시간을 반환
   * googleId, email, time
   * googleInput이 만료된 경우 -> 400 반환
   */
  async getGoogleUser(input: GoogleLoginInput): Promise<GoogleUser> {
    const google = this.configRegister.getGoogle();

    const oAuth2Client = new OAuth2Client();

    const ticket = await oAuth2Client.verifyIdToken({
      idToken: input.credential,
      audience: input.clientId,
    });

    const { sub, email, aud } = ticket.getPayload()!; //todo

    console.log(aud, google.CLIENT_ID);

    if (aud !== google.CLIENT_ID) {
      throw new BadRequestException();
    }

    return {
      googleId: sub,
      googleEmail: email,
      linkedAt: new StatDate(),
    };
  }

  /**
   *
   * userId로 조회 후 user가 없으면 새로 생성
   * googleUser도 들어왔을 경우 google 정보도 업데이트
   */
  async upsertLogin(userId: number, googleUser?: GoogleUser): Promise<account> {
    const updateData: account = {
      userId,
      googleId: googleUser?.googleId,
      googleEmail: googleUser?.googleEmail,
      linkedAt: googleUser?.linkedAt,
    };

    const user = await this.accountModel.findOneAndUpdate(
      { userId },
      updateData,
      { upsert: true, new: true },
    );

    return user;
  }

  /**
   *
   * userId로 조회 후 accessToken과 refreshToken을 등록
   * userId로 조회되지 않는 경우 -> 400반환
   *
   * userId, accessToken, refreshToken을 반환함
   */
  async updateToken(userId: number): Promise<LoginSuccess> {
    const { accessToken, refreshToken } = await this.generateTokenPair(userId);

    const newToken = await this.tokenModel.findOneAndUpdate(
      { userId },
      { userId, accessToken, refreshToken },
      { upsert: true, new: true },
    );

    if (!newToken) {
      throw new BadRequestException();
    }

    return {
      ...newToken,
      message: 'OK',
    };
  }

  /**
   *
   * header에 첨부된 accessToken을 decoding해 userId를 가져옴
   * googleInput을 통해 googleId, googleEmail, linkedAt을 받아옴
   * userId로 find 후 구글 정보들을 upsert 혹은 새로 만든 후 업데이트 전 데이터를 반환 //todo
   * 없는 유저가 이 함수를 시도할 경우 -> 500 반환
   */
  async linkGoogle(userId: number, google: GoogleLoginInput): Promise<account> {
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
      throw new InternalServerErrorException();
    }

    return user;
  }

  /**
   *
   * header에 첨부된 accessToken을 decoding해 userId를 가져옴
   * userId로 find 후 google과 관련된 정보를 삭제함
   * 없는 유저가 이 함수를 시도할 경우 -> 500 반환
   */
  async unlinkGoogle(userId: number): Promise<account> {
    const user = await this.accountModel.findOneAndUpdate(
      { userId },
      { $unset: { googleId: 1, googleEmail: 1, linkedAt: 1 } },
    );

    if (!user) {
      throw new InternalServerErrorException();
    }

    return user;
  }

  /**
   *
   * input에 들어오는 userId는 AccountModel에 존재하는 유저이어야함
   * userId를 이용해 token을 생성함
   */
  async generateToken(userId: number, expiresIn: string): Promise<string> {
    const jwt = this.configRegister.getJwt();

    return await this.jwtService.signAsync(
      { userId },
      {
        expiresIn: expiresIn,
        secret: jwt.SECRET,
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

    const jwt = this.configRegister.getJwt();

    const accessToken = await this.generateToken(userId, jwt.ACCESS_EXPIRES);

    const newTokens = await this.tokenModel.findOneAndUpdate(
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

  /**
   *
   * header에 첨부된 accessToken을 가져옴
   * tokenDB에서 가져온 accessToken을 통해 find하고 해당 데이터를 삭제함
   * 지운 토큰의 수를 반환함 (1)
   */
  async logout(accessToken: string): Promise<number> {
    const { deletedCount } = await this.tokenModel.deleteOne({
      accessToken,
    });

    return deletedCount;
  }

  /**
   *
   * header에 첨부된 accessToken을 decoding해 userId를 가져옴
   * userId로 로그인했던 모든 토큰기록을 삭제함
   * userId로 가입했던 정보를 삭제함
   * 지운 계정의 수를 반환함 (1)
   */
  async deleteAccount(userId: number): Promise<number> {
    await this.tokenModel.deleteMany({ userId });

    const { deletedCount } = await this.accountModel.deleteOne({ userId });

    return deletedCount;
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

    await this.tokenModel.deleteMany({
      _id: {
        $lt: mongoose.Types.ObjectId.createFromTime(
          Math.floor(beforeOneWeek.getTime() / StatDate.SEC),
        ),
      },
    });
  }
}
