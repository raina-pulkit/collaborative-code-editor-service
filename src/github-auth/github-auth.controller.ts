import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { GithubAuthService } from './github-auth.service';

@Controller('github-auth')
export class GithubAuthController {
  constructor(
    private readonly githubAuthService: GithubAuthService,
  ) {}

  @Post('/auth/github/callback')
  @HttpCode(200)
  githubCallback(
    @Body('code') code: string
  ): Promise<any> { // TODO: Replace 'any' with the correct return type
    return this.githubAuthService.getAccessToken(code);
  }
}
