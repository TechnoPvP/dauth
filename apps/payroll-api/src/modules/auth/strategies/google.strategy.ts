import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptionsWithRequest } from 'passport-google-oauth20';
import { GoogleProfileEntity } from '../entities/google-profile.entity';
import { AuthService } from '../auth.service';
import { Inject } from '@nestjs/common';

export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {
    super({
      clientID: process.env['GOOGLE_CLIENT_ID'],
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
      callbackURL: 'http://localhost:5050/auth/google/callback',
      scope: ['email', 'profile'],
    } as StrategyOptionsWithRequest);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfileEntity,
    done: (error: string | null, user: GoogleProfileEntity) => void
  ) {
    const user = await this.authService.googleCallback({
      profile,
      accessToken,
      refreshToken,
    });

    return done(null, profile);
  }
}
