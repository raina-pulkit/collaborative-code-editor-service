import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubAuthService } from './github-auth/github-auth.service';
import { GithubAuthController } from './github-auth/github-auth.controller';
import { RequestService } from './request/request.service';
import { RequestModule } from './request/request.module';
import { GithubAuthModule } from './github-auth/github-auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [RequestModule, GithubAuthModule, HttpModule],
  controllers: [AppController, GithubAuthController],
  providers: [AppService, GithubAuthService,],
})
export class AppModule {}
