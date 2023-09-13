import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionSerializer } from './session/session.serializer';
import { GithubStrategy } from './strategies/github.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AzureAdAuthStrategy } from './strategies/azure-ad.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env['JWT_PRIVATE_KEY'],
      signOptions: { expiresIn: '900s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    GithubStrategy,
    GoogleStrategy,
    JwtStrategy,
    AzureAdAuthStrategy,
    SessionSerializer,
  ],
  exports: [AuthService],
})
export class AuthModule {}
