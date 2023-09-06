import { Prisma } from '@prisma/client';
import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto implements Prisma.UserUncheckedCreateInput {
  id?: number;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
