import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import passport from 'passport';

@Injectable()
export class GithubAuthGuard extends AuthGuard('github') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const redirectUrl = request.query?.redirectUrl as string;
    if (redirectUrl) request.session.redirectUrl = redirectUrl;

    const result = (await super.canActivate(context)) as boolean;
    const user = request?.user;

    if (!user) return false;

    await new Promise<void>((resolve, reject) =>
      request.logIn(
        { ...user },
        { session: true, keepSessionInfo: true },
        (err: any) => (err ? reject(err) : resolve())
      )
    );

    return result;
  }
}
