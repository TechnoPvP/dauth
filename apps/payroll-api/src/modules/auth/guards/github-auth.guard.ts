import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import passport from 'passport';

@Injectable()
export class GithubAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    // const result = (await super.canActivate(context)) as boolean;

    return new Promise((resolve, reject) => {
      passport.authenticate(
        'github',
        { session: true,  },
        (err: any, user: any, info: any) => {

          console.log({user, err, info});

          if (err || !user) {
            reject(new UnauthorizedException());
            return;
          }
          request.user = user;
          resolve(true);
        }
      )(request, response);
    });

    // return result;
  }
}
