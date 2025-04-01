import { ConfigService } from '@nestjs/config';
import { Config } from '../config/config.types';
import { CONFIG } from '../config/config.constants';

export function getConfig(configService: ConfigService): Config {
  const config = configService.get<Config>(CONFIG);
  if (!config) throw new Error('Config is undefined');

  return config;
}