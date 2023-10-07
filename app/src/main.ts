import { ValidationPipe } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { type RUNTIME_CONFIG, RUNTIME_CONFIG_KEY } from './config/runtime';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const runtimeConfig =
    configService.getOrThrow<ConfigType<typeof RUNTIME_CONFIG>>(
      RUNTIME_CONFIG_KEY,
    );

  app.enableCors({
    origin: runtimeConfig.PROD
      ? 'https://stat.42seoul.kr'
      : [
          'https://statdev.cloud',
          'https://d1571ej1ecqlkv.cloudfront.net',
          'http://localhost:8080',
        ],
    methods: ['POST'],
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(runtimeConfig.PORT);
}

bootstrap();
