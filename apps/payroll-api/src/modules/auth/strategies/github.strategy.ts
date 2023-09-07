import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-github2';
import { GithubProfileEntity } from '../../../common/auth/github/github-profile.entity';
import { AuthService } from '../auth.service';
import { Inject } from '@nestjs/common';

export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {
    super({
      clientID: process.env['GITHUB_CLIENT_ID'],
      clientSecret: process.env['GITHUB_CLIENT_SECRET'],
      callbackURL: 'http://localhost:5050/auth/github/callback',
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GithubProfileEntity,
    done: (err: string | null, profile: any) => void
  ): Promise<any> {
    // console.log({ accessToken, refreshToken, profile });
    await this.authService.githubCallback({ profile, accessToken });
    return done(null, profile);
  }
}
