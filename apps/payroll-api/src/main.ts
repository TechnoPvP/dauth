import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';
import { AppModule } from './app/app.module';
import { createClient } from 'redis';
import RedisStoreCLient from 'connect-redis';

// const client = new PrismaClient();

export const redisClient = createClient({
  url: 'redis://localhost:6379',
});

const store = new RedisStoreCLient({
  client: redisClient,
});

const bootstrapRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to redis');
  } catch (error) {
    console.log("Error connection", error);
  }
};

bootstrapRedis()

const expressSession = session({
  secret: 'daw31231231231dd',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  },
  store: store,
  // store: new PrismaSessionStore(client, {
  //   checkPeriod: 2 * 60 * 1000,
  //   dbRecordIdIsSessionId: true,
  //   dbRecordIdFunction: undefined,
  //   logger: console,
  // }),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 5050;

  app.enableCors({
    credentials: true,
    origin: (
      requestOrigin: string,
      callback: (err: Error | null, origin?: any) => void
    ) => {
      return callback(null, requestOrigin);
    },
  });

  app.use(expressSession);
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

declare module 'express-session' {
  interface SessionData {
    user?: any;
    passport?: any;
    redirectUrl?: string;
  }
}

bootstrap();
