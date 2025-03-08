import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { parameterValidator } from 'config/validator';
import { GithubAuthService } from './github-auth.service';

@Controller()
@ApiExcludeController()
export class GithubAuthController {
  constructor(private readonly githubAuthService: GithubAuthService) {}

  @Post('/auth/github/callback')
  @HttpCode(200)
  githubCallback(
    @Body('code', parameterValidator()) code: string,
  ): Promise<{ data: string }> {
    return this.githubAuthService.getUserDetails(code);
  }
}
