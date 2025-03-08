import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RequestModule } from 'modules/request/request.module';
import { UserModule } from 'modules/user/user.module';
import { GithubAuthService } from './github-auth.service';

@Module({
  imports: [RequestModule, HttpModule, UserModule],
  providers: [GithubAuthService],
})
export class GithubAuthModule {}
