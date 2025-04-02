import { ConfigService } from '@nestjs/config';

import { CONFIG } from '../config/config.constants';
import { Config } from '../config/config.types';

export function getConfig(configService: ConfigService): Config {
  const config = configService.get<Config>(CONFIG);
  if (!config) throw new Error('Config is undefined');

  return config;
}
