import { ConfigService } from '@nestjs/config';
import { getConfig } from './utils/get-config-util';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const config = getConfig(configService);

  await app.listen(config.serverPort, config.serverIp);
  console.log(`Server is running on ${config.serverIp}:${config.serverPort}`);
}
bootstrap();
