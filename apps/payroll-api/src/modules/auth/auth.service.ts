import { Injectable, Logger } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger();

  constructor(
    private readonly user: UsersService
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.user.retrieveByEmail(loginDto.email);

    const isValidPassword = compareSync(loginDto.password, user.password);

    if (user && isValidPassword) {
      const { password, ...userData } = user;

      return userData;
    }

    return null;
  }
}
