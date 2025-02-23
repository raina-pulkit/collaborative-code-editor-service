import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AxiosRequestConfig, Method } from 'axios';
import { lastValueFrom } from 'rxjs';

export interface User {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  id?: string | number;
  ip_address?: string;
  email?: string;
  username?: string;
  geo?: GeoLocation;
}
export interface GeoLocation {
  country_code?: string;
  region?: string;
  city?: string;
}

export interface HttpRequestOptions extends OutgoingHttpRequest {
  errorMessage: string;
}

export interface OutgoingHttpRequest extends AxiosRequestConfig {
  data?: User;
}

@Injectable()
export class RequestService {
  constructor(private readonly httpService: HttpService) {}

  async makeHttpRequest({
    url,
    data,
    headers,
    errorMessage,
    params,
    method = <Method>'get',
  }: HttpRequestOptions): Promise<unknown> {
    const options: AxiosRequestConfig = {
      url,
      method,
      headers,
    };

    if (data) {
      options.data = data;
    }

    if (params) {
      options.params = params;
    }

    try {
      return (await lastValueFrom(this.httpService.request(options)))?.data;
    } catch (rawError: unknown) {
      const error = <
        {
          response?: { data: { message: string }; status: number };
          message?: string;
        }
      >rawError;

      const message = error.response?.data?.message || error.message;
      error.message = `${errorMessage}: ${message}`;
      throw this.getProperError(error, error.response?.status);
    }
  }

  private getProperError(error: unknown, status: number): HttpException {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return new BadRequestException(error);
      case HttpStatus.CONFLICT:
        return new ConflictException(error);
      case HttpStatus.NOT_FOUND:
        return new NotFoundException(error);
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return new UnprocessableEntityException(error);
      case HttpStatus.UNAUTHORIZED:
        return new UnauthorizedException(error);
      case HttpStatus.FORBIDDEN:
        return new ForbiddenException(error);
      case HttpStatus.METHOD_NOT_ALLOWED:
        return new MethodNotAllowedException(error);
      default:
        return new HttpException(error, status);
    }
  }
}
