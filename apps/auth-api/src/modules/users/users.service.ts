import { PrismaService } from '@dauth/database-service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcrypt';
import { AuthProvider } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: Figure out how to handle auth providers
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await hash(createUserDto.password, 10);
    const { password, ...userData } = createUserDto;

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        auth_provider: AuthProvider.LOCAL,
        local_auth: { create: { password: hashedPassword } },
      },
    });

    return user;
  }

  async list() {
    const users = await this.prisma.user.findMany();

    return users;
  }

  async retrieve(id: number) {
    const users = await this.prisma.user.findUniqueOrThrow({ where: { id } });

    return users;
  }

  async retrieveByEmail(email: string) {
    const users = await this.prisma.user.findFirstOrThrow({
      where: { email },
      include: {
        github_auth: true,
        google_auth: true,
        local_auth: true,
        microsoft_auth: true,
      },
    });

    return users;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const hashedPassword = updateUserDto.password
      ? await hash(updateUserDto.password, 10)
      : undefined;

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user)
      throw new HttpException(
        'Unable to find user by id',
        HttpStatus.BAD_REQUEST
      );

    const users = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        ...(user.auth_provider === AuthProvider.LOCAL
          ? { local_auth: { update: { password: hashedPassword } } }
          : undefined),
      },
    });

    return users;
  }

  async remove(id: number) {
    const users = await this.prisma.user.delete({ where: { id } });

    return users;
  }
}
