import { AuthProvider } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class Auth {}

export class BaseAuthEntity<T> {
  data!: T;

  @IsEnum(AuthProvider)
  type!: AuthProvider;

  @IsString()
  redirect_uri?: string;
}
