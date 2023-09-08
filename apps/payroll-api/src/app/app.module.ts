import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';

import { DatabaseModule } from '@dauth/database-service';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../modules/auth/auth.module';
import { UsersModule } from '../modules/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';
import passport from 'passport';

const client = new PrismaClient();

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    PassportModule.register({ session: true, defaultStrategy: 'local' }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        forbidNonWhitelisted: true,
        whitelist: true,
      }),
    },
    // {
    //   provide: APP_FILTER,
    //   useClass: UnauthorizedExceptionFilter,
    // },
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(
  //       session({
  //         secret: 'daw31231231231dd',
  //         resave: true,
  //         saveUninitialized: true,
  //         cookie: {
  //           secure: false,
  //           domain: 'localhost',
  //           httpOnly: true,
  //           maxAge: 1000 * 60 * 60,
  //         },
  //         store: new PrismaSessionStore(client, {
  //           checkPeriod: 2 * 60 * 1000,
  //           dbRecordIdIsSessionId: true,
  //         }),
  //       }),
  //       passport.initialize(),
  //       passport.session()
  //     )
  //     .forRoutes('*');
  // }
}
