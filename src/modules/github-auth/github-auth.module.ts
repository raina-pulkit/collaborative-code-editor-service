import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RequestModule } from 'modules/request/request.module';
import { UserModule } from 'modules/user/user.module';
import { GithubAuthService } from './github-auth.service';

@Module({
  imports: [
    RequestModule,
    HttpModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1hr' },
    }),
  ],
  providers: [GithubAuthService],
})
export class GithubAuthModule {}
