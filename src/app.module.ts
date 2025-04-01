import { Module } from '@nestjs/common';

import config from './config/config';
import { getConfig } from './utils/get-config-util';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = getConfig(configService);
        const postgresSettings = config.postgresSettings;

        return {
          type: 'postgres',
          host: postgresSettings.host,
          port: postgresSettings.port,
          username: postgresSettings.username,
          password: postgresSettings.password,
          database: postgresSettings.database,
          autoLoadEntities: postgresSettings.autoLoadEntities,
          synchronize: postgresSettings.synchronize,
        };
      },
    }),
    UsersModule,
    PostsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
