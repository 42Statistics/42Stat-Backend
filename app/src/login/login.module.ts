import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from 'src/auth/token/token.module';
import { JWT_CONFIG } from 'src/config/jwt';
import { AccountModule } from 'src/login/account/account.module';
import { LoginResolver } from './login.resolver';
import { LoginService } from './login.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [JWT_CONFIG.KEY],
      useFactory: (jwtConfig: ConfigType<typeof JWT_CONFIG>) => {
        return {
          secret: jwtConfig.SECRET,
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
