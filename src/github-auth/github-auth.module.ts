import { Module } from '@nestjs/common';
import { GithubAuthService } from './github-auth.service';
import { HttpModule } from '@nestjs/axios';
import { RequestModule } from 'src/request/request.module';

@Module({
  imports: [RequestModule, HttpModule],
  providers: [GithubAuthService],
})
export class GithubAuthModule {}
