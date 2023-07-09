import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { OAuth2Client } from 'google-auth-library';
import type { FilterQuery, Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { StatDate } from 'src/statDate/StatDate';
import { AccountDocument, account } from './db/account.database.schema';
import { token } from './db/token.database.schema';
import type { GoogleLoginInput, loginInput } from './dtos/login.dto';
import type {
  GoogleUser,
  StatusUnion,
  UserPreviewWithDisplayname,
} from './models/login.model';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(account.name) private accountModel: Model<account>,
    @InjectModel(token.name) private tokenModel: Model<token>,
    private cursusUserService: CursusUserService,
    private readonly httpService: HttpService,
    private jwtService: JwtService,
  ) {}

  async findAccountByUserId(
    userId: number,
  ): Promise<UserPreviewWithDisplayname> {
    const user = await this.accountModel.findOne({ userId });

    if (!user) {
      const cursusUser = await this.cursusUserService.findOneByUserId(userId);

      const login = cursusUser.user.login;
      const imgUrl = cursusUser.user.image.link;
      const displayname = cursusUser.user.displayname;

      await this.accountModel.create({
        userId,
        login,
        displayname,
        imgUrl,
        createdAt: new StatDate(),
      });

      return { id: userId, login, imgUrl, displayname };
    }

    return {
      id: userId,
      login: user?.login,
      imgUrl: user.imgUrl,
      displayname: user.displayname,
    };
  }

  async findOneAccount(
    filter?: FilterQuery<account>,
  ): Promise<AccountDocument> {
    const login = await this.accountModel.findOne(filter);

    if (!login) {
      throw new NotFoundException();
    }

    return login;
  }

  async login({ code, google }: loginInput): Promise<typeof StatusUnion> {
    if (code && google) {
      const login42 = await this.loginWith42(code);
      const googleUser = await this.getGoogleUser(google);

      if (login42.status !== 200) {
        return login42;
      }

      await this.upsertLogin(login42.userPreview.id, googleUser);

      const accessToken = await this.generateAcccessToken(
        login42.userPreview.id,
      );
      const refreshToken = await this.generateRefreshToken(
        login42.userPreview.id,
      );

      return await this.upsertToken(
        login42.userPreview.id,
        accessToken,
        refreshToken,
      );
    }

    if (code) {
      const login42 = await this.loginWith42(code);
      if (login42.status !== 200) {
        return login42;
      }
      //todo: check google userPreview delete
      await this.upsertLogin(login42.userPreview.id);

      const accessToken = await this.generateAcccessToken(
        login42.userPreview.id,
      );
      const refreshToken = await this.generateRefreshToken(
        login42.userPreview.id,
      );

      return await this.upsertToken(
        login42.userPreview.id,
        accessToken,
        refreshToken,
      );
    }

    if (google) {
      return await this.loginWithGoogle(google);
    }

    //error
    return {
      status: 404,
      message: 'Nothing input',
    };
  }

  async loginWith42(code: string): Promise<typeof StatusUnion> {
    const apiUid = process.env.CLIENT_ID;
    const apiSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;
    const intraTokenUrl = 'https://api.intra.42.fr/oauth/token';
    const intraMeUrl = 'https://api.intra.42.fr/v2/me';

    if (!(apiUid && apiSecret && redirectUri)) {
      return {
        status: 500,
        message: 'Missing environment configuration',
      };
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

      return {
        userPreview: await this.findAccountByUserId(userInfo.data.id),
        accessToken: tokens.data.access_token,
        refreshToken: tokens.data.refresh_token,
        status: 200,
      };
    } catch (e) {
      return {
        status: 401,
        message: 'Token error',
      };
    }
  }

  async loginWithGoogle(
    googleInput: GoogleLoginInput,
  ): Promise<typeof StatusUnion> {
    const googleUser = await this.getGoogleUser(googleInput);
    const user = await this.accountModel.findOne({
      googleId: googleUser.googleId,
    });

    if (!user) {
      return {
        status: 401,
        message: 'No associated 42 account found',
      };
    }

    const token = await this.tokenModel.findOne({ userId: user.userId });

    if (!token) {
      const accessToken = await this.generateAcccessToken(user.userId);
      const refreshToken = await this.generateRefreshToken(user.userId);

      await this.upsertToken(user.userId, accessToken, refreshToken);

      return {
        userPreview: await this.findAccountByUserId(user.userId),
        accessToken,
        refreshToken,
        status: 200,
      };
    }

    return {
      userPreview: await this.findAccountByUserId(token.userId),
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      status: 200,
    };
  }

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
        throw new UnauthorizedException();
      }

      return {
        googleId: payload.sub,
        email: payload.email,
        time: new StatDate(),
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async upsertLogin(userId: number, googleUser?: GoogleUser): Promise<boolean> {
    const updateData = googleUser
      ? {
          userId,
          googleId: googleUser.googleId,
          googleEmail: googleUser.email,
          linkedTime: googleUser.time,
        }
      : { userId };
    //todo: null로 들어가도 되는지 확인
    const user = await this.accountModel.findOneAndUpdate(
      { userId },
      updateData,
    );
    if (!user) {
      await this.accountModel.create(updateData);
    }

    return true;
  }

  async upsertToken(
    userId: number,
    accessToken: string,
    refreshToken: string,
  ): Promise<typeof StatusUnion> {
    const newToken = await this.tokenModel.findOneAndUpdate(
      { userId },
      { userId, accessToken, refreshToken },
      { upsert: true, new: true }, //todo not upsert
    );

    return {
      userPreview: await this.findAccountByUserId(newToken.userId),
      accessToken: newToken.accessToken,
      refreshToken: newToken.refreshToken,
      status: 200,
    };
  }

  async linkGoogle(
    accessToken: string,
    google: GoogleLoginInput,
  ): Promise<boolean> {
    if (!accessToken || !accessToken.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }

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
        googleEmail: googleUser.email,
        linkedTime: new StatDate(),
      },
      { upsert: true, new: true },
    );

    if (!user || !googleUser) {
      return false;
    }

    return true;
  }

  async unlinkGoogle(accessToken: string): Promise<boolean> {
    if (!accessToken || !accessToken.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }

    const token = accessToken.split(' ')[1];

    const { userId } = await this.jwtService.verifyAsync<{
      userId: number;
      iat: number;
      exp: number;
    }>(token);

    const user = await this.accountModel.findOneAndUpdate(
      { userId },
      { $unset: { googleId: 1, googleEmail: 1, linkedTime: 1 } },
    );

    if (!user) {
      return false;
    }

    return true;
  }

  /**-----token-----**/

  async generateAcccessToken(userId: number): Promise<string> {
    const user = await this.findOneAccount({ userId });
    const payload = { userId: user.userId };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: process.env.JWT_SECRET,
    });

    return accessToken;
  }

  async generateRefreshToken(userId: number): Promise<string> {
    const user = await this.findOneAccount({ userId });
    const payload = { userId: user.userId };
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '20m',
      secret: process.env.JWT_SECRET,
    });

    return refreshToken;
  }

  async refreshToken(
    accessToken: string,
    refreshToken: string,
  ): Promise<typeof StatusUnion> {
    //todo: 401 throw 중
    const { exp: e, userId: u } = await this.jwtService.verifyAsync(
      accessToken,
    );

    if (StatDate.now() < e * 1000) {
      return {
        status: 200,
        accessToken,
        refreshToken,
        userPreview: await this.findAccountByUserId(u),
      };
    }

    try {
      const { userId, iat, exp } = await this.jwtService.verifyAsync<{
        userId: number;
        iat: number;
        exp: number;
      }>(refreshToken);

      const newAccessToken = await this.generateAcccessToken(userId);

      await this.tokenModel.findOneAndUpdate(
        { userId },
        { userId, newAccessToken, refreshToken },
        { upsert: true, new: true },
      );

      return {
        userPreview: await this.findAccountByUserId(userId),
        accessToken: newAccessToken,
        refreshToken,
        status: 200,
      };
    } catch (e) {
      return {
        status: 400,
        message: '유효하지 않은 refreshToken',
      };
    }
  }

  async logout(accessToken: string): Promise<boolean> {
    if (!accessToken || !accessToken.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }

    const token = accessToken.split(' ')[1];

    const tmp = await this.tokenModel.deleteOne({ accessToken: token });
    if (!tmp) {
      return false;
    }
    return true;
  }

  async deleteAccount(accessToken: string): Promise<boolean> {
    if (!accessToken || !accessToken.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }

    const token = accessToken.split(' ')[1];

    const { userId } = await this.jwtService.verifyAsync<{
      userId: number;
      iat: number;
      exp: number;
    }>(token);

    await this.tokenModel.deleteMany({ userId });

    const tmp = await this.accountModel.deleteOne({ userId });
    if (!tmp) {
      return false;
    }
    return true;
  }
}
