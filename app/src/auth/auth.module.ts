import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginUserSchema, login_user } from './auth.database.schema';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: login_user.name, schema: LoginUserSchema },
    ]),
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
