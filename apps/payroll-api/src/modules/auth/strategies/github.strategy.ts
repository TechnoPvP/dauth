import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOption, StrategyOptions } from 'passport-github2';
import { VerifyFunctionWithRequest } from 'passport-local';

export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(params) {
    super({
      clientID: process.env['GITHUB_CLIENT_ID'],
      clientSecret: process.env['GITHUB_CLIENT_SECRET'],
      callbackURL: 'http://localhost:4200/success',
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile,
    done: (err: string, profile: any) => void
  ): Promise<any> {

    console.log(accessToken, refreshToken);
    // Here you can handle the user profile received from GitHub and decide how you want to process
    // You can save the user to the database, or find the user in the database and return the user
    // For demonstration purposes, we'll just return the profile
    return done('Some error happened', profile);
  }
}
