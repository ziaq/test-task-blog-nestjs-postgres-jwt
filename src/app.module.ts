import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import config from './config/config';
import { getConfig } from './utils/get-config-util';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
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
    PassportModule,
    UsersModule,
    PostsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
