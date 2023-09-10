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
  ],
})
export class AppModule {}
