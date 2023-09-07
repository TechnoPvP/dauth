import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOption, StrategyOptions } from 'passport-github2';
import { VerifyFunctionWithRequest } from 'passport-local';

export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(params: any) {
    super({
      clientID: process.env['GITHUB_CLIENT_ID'],
      clientSecret: process.env['GITHUB_CLIENT_SECRET'],
      callbackURL: 'http://localhost:4200/success',
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: string, profile: any) => void
  ): Promise<any> {
    // Here you can handle the user profile received from GitHub and decide how you want to process
    // You can save the user to the database, or find the user in the database and return the user
    // For demonstration purposes, we'll just return the profile
    console.log({ accessToken, refreshToken, profile });
    return done('Some error happened', profile);
  }
}
