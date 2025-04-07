import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import * as swaggerUi from 'swagger-ui-express';

import { buildOpenApi } from './openapi/build-openapi';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const configService = app.get(AppConfigService);
  const config = configService.getConfig();

  const openApiDocument = buildOpenApi(config);
  app.use('/api', swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  app.enableCors({
    origin: config.clientUrl,
    credentials: true,
  });

  await app.listen(config.serverPort, config.serverHost);
  console.log(`Server is running on ${config.serverHost}:${config.serverPort}`);
}
void bootstrap();
