import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      session: false,
      secretOrKey: process.env['JWT_PRIVATE_KEY'],
    } as StrategyOptions);
  }

  async validate(payload: any) {
    console.log('Started validating payload', payload);

    return payload;
  }
}
