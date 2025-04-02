import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { getConfig } from './utils/get-config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const config = getConfig(configService);

  await app.listen(config.serverPort, config.serverIp);
  console.log(`Server is running on ${config.serverIp}:${config.serverPort}`);
}
void bootstrap();
