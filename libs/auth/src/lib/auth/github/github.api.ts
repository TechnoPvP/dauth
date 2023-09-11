import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { Octokit } from 'octokit';

interface GithubApiParams {
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
}

interface FetchAccessTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

@Injectable()
export class GithubApi {
  private readonly logger = new Logger(GithubApi.name);

  private readonly clientId!: string | undefined;
  private readonly clientSecret!: string | undefined;
  private readonly redirectUri!: string | undefined;

  constructor(params?: GithubApiParams) {
    this.clientId = params?.clientId || process.env['GITHUB_CLIENT_ID'];
    this.clientSecret =
      params?.clientSecret || process.env['GITHUB_CLIENT_SECRET'];
    this.redirectUri =
      params?.redirectUri || process.env['GITHUB_REDIRECT_URI'];
  }

  private async fetchAccessToken(params: { authorizationCode: string }) {
    const ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';

    try {
      const response = await axios.post<FetchAccessTokenResponse>(
        ACCESS_TOKEN_URL,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: params.authorizationCode,
        },
        { headers: { Accept: 'application/json' } }
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error('Failed to fetch Github access token', {
          message: error.response?.data,
        });
      }
      this.logger.error('Failed to fetch Github access token');
      throw error;
    }
  }

  /**
   * Instantiate Github's Octokit API with user access code
   */
  async getAuthenticatedOctoKit(params?: {
    accessCode?: string;
    authorizationCode: string;
  }) {
    if (!params?.accessCode && !params?.authorizationCode)
      throw new HttpException(
        'Must specify either an accessCode or authorizationCode',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    return new Octokit({
      auth:
        params?.accessCode ||
        (
          await this.fetchAccessToken({
            authorizationCode: params.authorizationCode,
          })
        ).access_token,
    });
  }
}
