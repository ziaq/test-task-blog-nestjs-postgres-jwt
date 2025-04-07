import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from './config.types';
import { CONFIG } from './config';

@Injectable()
export class AppConfigService {
  private config: Config

  constructor(configService: ConfigService) {
    const config = configService.get<Config>(CONFIG);
    if (!config) throw new Error('Config is undefined in AppConfigService');
    this.config = config;
  }

  getConfig(): Config {
    return this.config;
  }
}
