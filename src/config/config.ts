import { registerAs } from '@nestjs/config';

import { Config } from './config.types';
import { envSchema } from './env.validation';

export const CONFIG = 'config';

export const config = registerAs(CONFIG, (): Config => {
  const env = envSchema.parse(process.env);

  return {
    nodeEnv: env.NODE_ENV,
    serverHost: env.SERVER_HOST,
    serverPort: env.SERVER_PORT,
    openApiUrl: env.OPENAPI_URL,
    clientUrl: env.CLIENT_URL,
    postgresSettings: {
      host: env.POSTGRES_HOST,
      port: env.POSTGRES_PORT,
      username: env.POSTGRES_USERNAME,
      password: env.POSTGRES_PASSWORD,
      database: env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: env.NODE_ENV === 'development',
    },
    jwtAccessSecret: env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: env.JWT_REFRESH_SECRET,
  };
});

