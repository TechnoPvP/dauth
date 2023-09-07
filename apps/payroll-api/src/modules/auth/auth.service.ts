import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/auth.dto';
import { GithubCallbackDto } from './dto/github-callback.dto';
import { GithubApi } from '../../common/auth/github/github.api';
import { PrismaService } from '@dauth/database-service';
import { AuthProvider, Prisma } from '@prisma/client';
import { BaseAuthEntity } from './entities/auth.entity';
import { GithubStrategy } from './strategies/github.strategy';
import { GithubProfileEntity } from '../../common/auth/github/github-profile.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger();

  constructor(
    private readonly prisma: PrismaService,
    private readonly user: UsersService,
    private readonly github: GithubApi
  ) {}

  async localLogin(loginDto: LoginDto) {
    const user = await this.user.retrieveByEmail(loginDto.email);

    if (user.auth_provider !== 'LOCAL' || !user.password)
      throw new HttpException(
        'Local auth provider is not active',
        HttpStatus.BAD_REQUEST
      );

    const isValidPassword = compareSync(loginDto.password, user?.password);

    if (user && isValidPassword) {
      const { password, ...userData } = user;

      return userData;
    }

    return null;
  }

  async githubCallback(
    githubCallbackDto: GithubCallbackDto
  ): Promise<BaseAuthEntity<any>> {
    const octokit = await this.github.getAuthenticatedOctoKit({
      authorizationCode: githubCallbackDto.code,
    });

    const { data } = await octokit.rest.users.getAuthenticated();
    const [firstName, lastName] = data.name?.split(' ') || 'Unknown Unknown';

    const user = await this.prisma.githubAuth.upsert({
      where: { githubId: data.id },
      update: {
        access_code: githubCallbackDto.code,
        api_url: data.url,
        bio: data.bio,
        username: data.login,
        html_url: data.html_url,
      },
      create: {
        access_code: githubCallbackDto.code,
        api_url: data.url,
        bio: data.bio,
        username: data.login,
        html_url: data.html_url,
        githubId: data.id,
        user: {
          create: {
            email: data?.email || `${data.login}@unknown.com`,
            first_name: firstName,
            last_name: lastName,
            avatar: data.avatar_url,
            auth_provider: AuthProvider.GITHUB,
          },
        },
      },
      include: { user: true },
    });

    return { data: user, type: AuthProvider.GITHUB, redirect_uri: '' };
  }

  async githubCallbackV2(params: {
    profile: GithubProfileEntity;
    accessToken: string;
  }): Promise<BaseAuthEntity<any>> {
    const profile = params.profile;

    const [firstName, lastName] =
      profile.displayName?.split(' ') || 'Unknown Unknown';

    const GITHUB_USER_DATA: Omit<
      Prisma.GithubAuthCreateInput & Prisma.GithubAuthUpdateInput,
      'user'
    > = {
      access_code: params.accessToken,
      api_url: profile._json.url,
      bio: profile._json.bio,
      username: profile.username,
      html_url: profile.profileUrl,
      githubId: +profile.id,
    };

    const user = await this.prisma.githubAuth.upsert({
      where: { githubId: +profile.id },
      update: {
        ...GITHUB_USER_DATA,
      },
      create: {
        ...GITHUB_USER_DATA,
        user: {
          create: {
            email: `${profile.username}@github.com`,
            // email: profile?.email || `${profile.login}@unknown.com`,
            // avatar: profile.avatar_url,
            first_name: firstName,
            last_name: lastName,
            auth_provider: AuthProvider.GITHUB,
          },
        },
      },
      include: { user: true },
    });

    return { data: user, type: AuthProvider.GITHUB, redirect_uri: '' };
  }
}
