import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubAuthService } from './modules/github-auth/github-auth.service';
import { GithubAuthController } from './modules/github-auth/github-auth.controller';
import { RequestService } from './modules/request/request.service';
import { RequestModule } from './modules/request/request.module';
import { GithubAuthModule } from './modules/github-auth/github-auth.module';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [RequestModule, GithubAuthModule, HttpModule, UserModule],
  controllers: [AppController, GithubAuthController],
  providers: [AppService, GithubAuthService,],
})
export class AppModule {}
