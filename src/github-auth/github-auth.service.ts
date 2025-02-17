import { Injectable } from '@nestjs/common';
import { Method } from 'axios';
import { RequestService } from 'src/request/request.service';

@Injectable()
export class GithubAuthService {
  constructor(
    private readonly requestService: RequestService,
  ) {}
  getAccessToken = (code: string): Promise<any> => { // TODO: Replace 'any' with the correct return type
    const url = this.getGithubUrl();
    const client_id = process.env.GITHUB_CLIENT_ID;
    const client_secret = process.env.GITHUB_CLIENT_SECRET;

    return this.requestService.makeHttpRequest({
      url,
      method: <Method>'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      data: {
        client_id,
        client_secret,
        code,
      },
      errorMessage: 'Failed to get access token from Github',
    })
  }

  private getGithubUrl = (): string => process.env.GITHUB_URL;
}
