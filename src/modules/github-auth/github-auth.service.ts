import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Method } from 'axios';
import { RequestService } from 'src/modules/request/request.service';
import { UserDetails } from 'src/types/user/user-details';
import * as jwt from 'jsonwebtoken';

interface GithubAccessTokenResponse {
  access_token?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
  error_uri?: string;
}

@Injectable()
export class GithubAuthService {
  constructor(private readonly requestService: RequestService) {}

  getUserDetails = async (code: string): Promise<{ data: string }> => {
    const accessTokenResponse = await this.getAccessToken(code);

    if (!accessTokenResponse || accessTokenResponse.error)
      throw new BadRequestException(
        accessTokenResponse?.error_description ||
          'Failed to get access token from Github',
      );
    else if (
      accessTokenResponse.token_type !== 'bearer' ||
      accessTokenResponse.access_token === ''
    ) {
      throw new UnauthorizedException(
        'Invalid token type received from Github',
      );
    }

    const userDetailsFromGithub = await this.getUserDetailsFromGithub(
      accessTokenResponse.access_token,
    );

    const dataToReturn = {
      // TODO: Add postgres DB and save user details in your own DB
      ...userDetailsFromGithub,
    };

    const jwtSecret = process.env.JWT_SECRET;
    const jwtToken = jwt.sign(dataToReturn, jwtSecret, {
      expiresIn: '1hr',
      algorithm: 'HS256',
    });

    return { data: jwtToken };
  };

  getAccessToken = (code: string): Promise<GithubAccessTokenResponse> => {
    const url = this.getGithubUrl();
    const client_id = process.env.GITHUB_CLIENT_ID;
    const client_secret = process.env.GITHUB_CLIENT_SECRET;
    const redirect_uri = process.env.GITHUB_REDIRECT_URI;

    return <Promise<GithubAccessTokenResponse>>(
      this.requestService.makeHttpRequest({
        url,
        method: <Method>'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        data: {
          client_id,
          client_secret,
          code,
          redirect_uri,
        },
        errorMessage: 'Failed to get access token from Github',
      })
    );
  };

  getUserDetailsFromGithub = async (
    accessToken: string,
  ): Promise<UserDetails> => {
    const url = this.getGithubUserDetailsUrl();
    const userDetails = <Partial<UserDetails>>(
      await this.requestService.makeHttpRequest({
        url,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        errorMessage: 'Failed to get user details from Github',
      })
    );

    const {
      login,
      id,
      avatar_url,
      html_url,
      name,
      email,
      bio,
      followers,
      following,
      created_at,
      updated_at,
    } = userDetails;

    const userDetailsReturn: UserDetails = {
      id,
      login,
      name,
      email,
      bio,
      avatar_url,
      html_url,
      followers,
      following,
      created_at,
      updated_at,
      accessToken,
      gender: '',
    };

    return userDetailsReturn;
  };

  private getGithubUrl = (): string => process.env.GITHUB_URL;
  private getGithubUserDetailsUrl = (): string =>
    process.env.GITHUB_FETCH_USER_DETAILS_URL;
}
