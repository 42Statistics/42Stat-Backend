import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema, token } from './db/token.database.schema';
import { TokenService } from './token.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: token.name, schema: TokenSchema }]),
  ],
  providers: [TokenService],
  exports: [MongooseModule, TokenService],
})
// eslint-disable-next-line
export class TokenModule {}
