import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubAuthService } from './modules/github-auth/github-auth.service';
import { GithubAuthController } from './modules/github-auth/github-auth.controller';
import { RequestModule } from './modules/request/request.module';
import { GithubAuthModule } from './modules/github-auth/github-auth.module';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configSchema } from 'config/config-schema';
import { TerminusModule } from '@nestjs/terminus';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getTypeormOptions } from '../ormconfig';

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: configSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    HealthCheckModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => getTypeormOptions(configService)
    }),
    HttpModule,
    RequestModule,
    GithubAuthModule,
    UserModule,
  ],
  controllers: [AppController, GithubAuthController],
  providers: [AppService, GithubAuthService],
})
export class AppModule {}
