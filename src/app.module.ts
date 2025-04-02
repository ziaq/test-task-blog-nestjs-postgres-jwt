import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from './config/config';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { UsersModule } from './modules/users/users.module';
import { getConfig } from './utils/get-config';

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
