import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IStrategyOptionsWithRequest, Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' } as IStrategyOptionsWithRequest);
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.login({ email: username, password });

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return user;
  }
}
