import { $Enums, Prisma } from '@prisma/client';
import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto implements Prisma.UserUncheckedCreateInput {
  id?: number;

  avatar?: string | null | undefined;

  @IsString()
  first_name!: string;

  @IsString()
  last_name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  auth_provider!: $Enums.AuthProvider;

  github_auth?: Prisma.GithubAuthUncheckedCreateNestedOneWithoutUserInput | undefined;
  google_auth?: Prisma.GoogleAuthUncheckedCreateNestedOneWithoutUserInput | undefined;
  microsoft_auth?: Prisma.MicrosoftAuthUncheckedCreateNestedOneWithoutUserInput | undefined;
}
