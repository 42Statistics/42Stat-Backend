import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema, account } from './db/account.database.schema';
import { TokenSchema, token } from './db/token.database.schema';
import { LoginResolver } from './login.resolver';
import { LoginService } from './login.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    MongooseModule.forFeature([{ name: account.name, schema: AccountSchema }]),
    MongooseModule.forFeature([{ name: token.name, schema: TokenSchema }]),
    HttpModule,
  ],
  providers: [LoginResolver, LoginService],
  exports: [LoginService],
})
export class LoginModule {}
