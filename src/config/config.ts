import { registerAs } from '@nestjs/config';

import { CONFIG } from './config.constants';
import { Config } from './config.types';
import { envSchema } from './env.schema';

export default registerAs(CONFIG, (): Config => {
  const env = envSchema.parse(process.env);

  return {
    nodeEnv: env.NODE_ENV,
    serverIp: env.SERVER_IP,
    serverPort: env.SERVER_PORT,
    clientIp: env.CLIENT_IP,
    clientPort: env.CLIENT_PORT,
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
