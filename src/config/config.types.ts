export type Config = {
  nodeEnv: 'development' | 'production';
  serverIp: string;
  serverPort: number;
  clientIp: string;
  clientPort: number;
  openApiHost: string;
  postgresSettings: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    autoLoadEntities: true;
    synchronize: boolean;
  };
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
};
