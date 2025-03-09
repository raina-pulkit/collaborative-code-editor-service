import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Method } from 'axios';
import { RequestService } from 'modules/request/request.service';
import { CreateUserDto } from 'modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'modules/user/dto/update-user.dto';
import { Gender, User } from 'modules/user/entities/user.entity';
import { UserService } from 'modules/user/user.service';
import { UserDetailsFromGithub } from 'types/user/user-details-from-github';

interface GithubAccessTokenResponse {
  access_token?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
  error_uri?: string;
}

@Injectable()
export class GithubAuthService {
  constructor(
    private readonly requestService: RequestService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

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

    if (!userDetailsFromGithub || !userDetailsFromGithub.id)
      throw new BadRequestException('Failed to get user details from Github');

    const userDetailsFormatted = await this.formatUserDetails(
      userDetailsFromGithub,
    );
    const {
      id,
      followers,
      following,
      email,
      githubId,
      githubUsername,
      githubLink,
      name,
      avatarUrl,
      bio,
      gender,
    } = userDetailsFormatted;

    const payload = {
      id,
      followers,
      following,
      email,
      githubId,
      githubUsername,
      githubLink,
      name,
      avatarUrl,
      bio,
      gender,
    };

    const jwtToken = this.jwtService.sign(payload, {
      expiresIn: '1hr',
      algorithm: 'HS256',
      issuer: 'PulkitRaina',
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
  ): Promise<UserDetailsFromGithub> => {
    const url = this.getGithubUserDetailsUrl();
    const userDetails = <Promise<UserDetailsFromGithub>>(
      this.requestService.makeHttpRequest({
        url,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        errorMessage: 'Failed to get user details from Github',
      })
    );

    return userDetails;
  };

  formatUserDetails = async (
    userDetails: UserDetailsFromGithub,
  ): Promise<User> => {
    const { id } = userDetails;
    const user = await this.userService.findOneById(+id);

    if (!user) {
      const userCreated: CreateUserDto = {
        email: userDetails.email,
        followers: userDetails.followers,
        following: userDetails.following,
        bio: userDetails.bio,
        gender: Gender.NULL,
        githubUsername: userDetails.login,
        githubLink: userDetails.url,
        avatarUrl: userDetails.avatar_url,
        githubId: userDetails.id,
        name: userDetails.name,
      };
      return this.userService.create(userCreated);
    } else {
      const userUpdated: UpdateUserDto = {
        ...user,
        followers: userDetails.followers,
        following: userDetails.following,
        email: userDetails.email,
        bio: user.bio ?? userDetails.bio,
        gender: user.gender ?? Gender.NULL,
        githubUsername: user.githubUsername ?? userDetails.login,
        githubLink: user.githubLink ?? userDetails.url,
        avatarUrl: user.avatarUrl ?? userDetails.avatar_url,
      };
      return this.userService.update(user.id, userUpdated);
    }
  };

  private getGithubUrl = (): string => process.env.GITHUB_URL;
  private getGithubUserDetailsUrl = (): string =>
    process.env.GITHUB_FETCH_USER_DETAILS_URL;
}
