import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AccountModule } from 'src/api/account/account.module';
import { TokenModule } from 'src/api/token/token.module';
import { LoginResolver } from './login.resolver';
import { LoginService } from './login.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    AccountModule,
    TokenModule,
    HttpModule,
    ConfigModule,
  ],
  providers: [LoginResolver, LoginService],
  exports: [LoginService],
})
export class LoginModule {}
