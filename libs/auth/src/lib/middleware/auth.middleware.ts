import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import passport from 'passport';
import { AuthModuleRegisterParams } from '../auth.module';
import { createExpressSession } from '../session/create-session.helper';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly sessionMiddleware!: RequestHandler;

  constructor(
    @Inject('AUTH_MODULE_OPTIONS')
    private readonly options: AuthModuleRegisterParams
  ) {
    this.sessionMiddleware = createExpressSession({
      client: options.client || new PrismaClient(),
      secret: 'daw31231231231dd',
    });
  }

  async use(req: any, res: any, next: (error?: any) => void) {
    try {
      await this.runMiddleware(req, res, this.sessionMiddleware);
      await this.runMiddleware(req, res, passport.initialize());
      await this.runMiddleware(req, res, passport.session());

      next();
    } catch (error) {
      next(error);
    }
  }

  private runMiddleware(
    req: Request,
    res: Response,
    fn: (req: Request, res: Response, next: NextFunction) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      fn(req, res, (err: unknown) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
