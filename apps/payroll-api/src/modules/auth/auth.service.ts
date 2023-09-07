import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/auth.dto';
import { GithubCallbackDto } from './dto/github-callback.dto';
import { GithubApi } from '../../common/auth/github/github.api';
import { PrismaService } from '@dauth/database-service';
import { AuthProvider } from '@prisma/client';

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

  async githubCallback(githubCallbackDto: GithubCallbackDto) {
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

    return user;
  }
}
