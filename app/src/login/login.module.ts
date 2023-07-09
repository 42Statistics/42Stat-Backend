import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { AccountSchema, account } from './db/account.database.schema';
import { TokenSchema, token } from './db/token.database.schema';
import { LoginResolver } from './login.resolver';
import { LoginService } from './login.service';

@Module({
  imports: [
    //todo:
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    MongooseModule.forFeature([{ name: account.name, schema: AccountSchema }]),
    MongooseModule.forFeature([{ name: token.name, schema: TokenSchema }]),
    HttpModule,
    CursusUserModule,
  ],
  providers: [LoginResolver, LoginService],
  exports: [LoginService],
})
export class LoginModule {}
