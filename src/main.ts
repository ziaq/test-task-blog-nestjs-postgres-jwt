import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import * as express from 'express';

import { getConfig } from './utils/get-config';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const config = getConfig(configService);

  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  app.enableCors({
    origin: `http://${config.clientIp}:${config.clientPort}`,
    credentials: true,
  });

  await app.listen(config.serverPort, config.serverIp);
  console.log(`Server is running on ${config.serverIp}:${config.serverPort}`);
}
void bootstrap();
