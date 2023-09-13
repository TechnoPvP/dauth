import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { AuthModuleRegisterParams } from '../auth.module';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

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

export const createExpressSession = (params: {
  client: PrismaClient;
  secret: string;
}) => {
  const prismaSessionStore = new PrismaSessionStore(params.client, {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
    logger: console,
  });

  return session({
    secret: params.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      domain: 'localhost',
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: prismaSessionStore,
  });
};
