import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: User, done: (err: Error | null, user: User) => void) {
    done(null, user);
  }

  deserializeUser(
    payload: User,
    done: (err: Error | null, user: User) => void
  ) {
    done(null, payload);
  }
}
