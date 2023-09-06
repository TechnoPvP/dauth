import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import session, { MemoryStore } from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';
import passport from 'passport';

const expressSession = session({
  secret: '12398damdm12adwmdaw129',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
  store: new PrismaSessionStore(new PrismaClient(), {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 5010;

  app.use(expressSession);
  app.use(passport.session());
  app.use(passport.initialize());

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
