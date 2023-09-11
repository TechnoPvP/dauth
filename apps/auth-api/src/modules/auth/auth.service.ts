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
import { GoogleProfileEntity } from './entities/google-profile.entity';
import { MicrosoftProfileEntity } from './entities/microsoft-profile.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger();

  constructor(
    private readonly prisma: PrismaService,
    private readonly user: UsersService,
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

  async githubCallback(params: {
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

  async googleCallback(params: {
    profile: GoogleProfileEntity;
    accessToken: string;
    refreshToken?: string;
  }) {
    const { profile } = params;

    const user = await this.prisma.googleAuth.upsert({
      where: { googleId: profile.id },
      create: {
        googleId: profile.id,
        access_code: params.accessToken,
        refresh_token: params.refreshToken,
        user: {
          create: {
            auth_provider: AuthProvider.GOOGLE,
            email: profile._json.email,
            first_name: profile._json.given_name,
            last_name: profile._json.family_name,
            avatar: profile._json.picture,
          },
        },
      },
      update: {
        googleId: profile.id,
        access_code: params.accessToken,
        refresh_token: params.refreshToken,
        user: {
          update: {
            auth_provider: AuthProvider.GOOGLE,
            email: profile._json.email,
            first_name: profile._json.given_name,
            last_name: profile._json.family_name,
            avatar: profile._json.picture,
          },
        },
      },
    });

    return user;
  }

  async microsoftCallback(params: { profile: MicrosoftProfileEntity }) {
    const { profile } = params;

    const name = this.getFormattedMicrosoftDisplayName(profile.displayName);

    const user = await this.prisma.microsoftAuth.upsert({
      where: { oid: profile.oid },
      create: {
        oid: profile.oid,
        email: profile._json.email,
        display_name: profile.displayName,
        user: {
          create: {
            auth_provider: AuthProvider.MICROSOFT,
            email: profile._json.email,
            first_name: name.firstName,
            last_name: name.lastName,
          },
        },
      },
      update: {
        oid: profile.oid,
        user: {
          update: {
            auth_provider: AuthProvider.GOOGLE,
            email: profile._json.email,
            first_name: name.firstName,
            last_name: name.lastName,
          },
        },
      },
    });

    return user;
  }

  getFormattedMicrosoftDisplayName(displayName: string) {
    const [name, companyName] = displayName
      .split('|')
      .map((part) => part.trim());

    let firstName: string | undefined = undefined;
    let middleName: string | undefined = undefined;
    let lastName: string | undefined = undefined;

    const nameParts = name.trim().split(' ');

    firstName = nameParts[0];

    //   Contains middle name
    if (nameParts.length >= 3) {
      middleName = nameParts[1];
      lastName = nameParts[2];
    } else {
      lastName = nameParts[1];
    }

    return { firstName, middleName, lastName, companyName };
  }
}
