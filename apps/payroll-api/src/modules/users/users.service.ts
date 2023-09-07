import { PrismaService } from '@dauth/database-service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: { ...createUserDto, password: hashedPassword },
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
    const users = await this.prisma.user.findFirstOrThrow({ where: { email } });

    return users;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const hashedPassword = updateUserDto.password
      ? await hash(updateUserDto.password, 10)
      : undefined;

    const users = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        password: hashedPassword,
      },
    });

    return users;
  }

  async remove(id: number) {
    const users = await this.prisma.user.delete({ where: { id } });

    return users;
  }
}
