import { DynamicModule, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { AuthMiddleware } from './middleware/auth.middleware';
import { SessionSerializer } from './session/session.serializer';

export interface AuthModuleRegisterParams {
  client?: PrismaClient;
}

export class AuthModule implements NestModule {
  static register(params?: AuthModuleRegisterParams): DynamicModule {
    return {
      module: AuthModule,
      imports: [],
      providers: [
        {
          provide: SessionSerializer,
          useClass: SessionSerializer,
        },
        AuthenticatedGuard,
        { provide: 'AUTH_MODULE_OPTIONS', useValue: { ...params } },
      ],
      exports: [],
      global: true,
    };
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
