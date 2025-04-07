import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { UsersModule } from './modules/users/users.module';
import { AppConfigModule } from './config/app-config.module';
import { AppConfigService } from './config/app-config.service';
import { validate } from './config/env.validation';
import { config } from './config/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        const config = appConfigService.getConfig();
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
