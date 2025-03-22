import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { configSchema } from 'config/config-schema';
import { getTypeormOptions } from '../ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubAuthController } from './modules/github-auth/github-auth.controller';
import { GithubAuthModule } from './modules/github-auth/github-auth.module';
import { GithubAuthService } from './modules/github-auth/github-auth.service';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { RequestModule } from './modules/request/request.module';
import { SocketModule } from './modules/socket/socket.module';
import { UserModule } from './modules/user/user.module';

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
      useFactory: (configService: ConfigService): TypeOrmModuleOptions =>
        getTypeormOptions(configService),
    }),
    HttpModule,
    RequestModule,
    GithubAuthModule,
    UserModule,
    SocketModule,
  ],
  controllers: [AppController, GithubAuthController],
  providers: [AppService, GithubAuthService],
})
export class AppModule {}
