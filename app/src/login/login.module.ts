import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from 'src/auth/token/token.module';
import { JWT_CONFIG, type JwtConfig } from 'src/config/jwt';
import { AccountModule } from 'src/login/account/account.module';
import { LoginResolver } from './login.resolver';
import { LoginService } from './login.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.getOrThrow<JwtConfig>(JWT_CONFIG).SECRET;

        return {
          secret,
        };
      },
    }),
    AccountModule,
    TokenModule,
    HttpModule,
  ],
  providers: [LoginResolver, LoginService],
  exports: [LoginService],
})
// eslint-disable-next-line
export class LoginModule {}
