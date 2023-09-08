import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  StrategyOptions,
  StrategyOptionsWithRequest,
} from 'passport-github2';
import { GithubProfileEntity } from '../../../common/auth/github/github-profile.entity';
import { AuthService } from '../auth.service';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {
    super({
      clientID: process.env['GITHUB_CLIENT_ID'],
      clientSecret: process.env['GITHUB_CLIENT_SECRET'],
      callbackURL: 'http://localhost:5050/auth/github/callback',
      passReqToCallback: true,
      session: true,
    } as StrategyOptionsWithRequest);
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: GithubProfileEntity,
    done: (err: string | null, profile: any) => void
  ): Promise<any> {
    // console.log({ accessToken, refreshToken, profile });
    const user = await this.authService.githubCallback({
      profile,
      accessToken,
    });

    done(null, {
      id: user.id,
      userId: user.user_id,
      authProvider: user.user.auth_provider,
    });

    return user;
  }

  // async authenticate() {
  //   super.authenticate((err, user, info) => {
  //     if (err) {
  //       throw err
  //     }
  //     if (!user) {
  //       throw new UnauthorizedException()
  //     }
  //   })
  // }

}
