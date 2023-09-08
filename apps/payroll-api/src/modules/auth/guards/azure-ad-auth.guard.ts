import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class AzureAdAuthGuard extends AuthGuard('azure-ad') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const result = (await super.canActivate(context)) as boolean;

    if (result && !request?.session?.passport) {
      request.session.redirectUrl =
        (request.query.redirectUrl as string) || 'http//localhost:4200';
      await super.logIn(request);
    }

    return result;
  }
}
