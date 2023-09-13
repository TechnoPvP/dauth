import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import session from 'express-session';

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
