import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'https://stat.42seoul.kr',
      'https://dacx6qkh9yupq.cloudfront.net',
      'https://localhost:8080',
    ],
    methods: ['POST'],
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(80);
}
bootstrap();
